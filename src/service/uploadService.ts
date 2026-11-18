import type {
  CheckResult,
  FindingsResponse,
  ProgressResponse,
  UploadResponse,
} from "../types/upload";

/** Direct browser requests keep large PDFs out of Vercel Functions. */
export class ApiError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 0, code = "http") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function normalizeBaseUrl(raw: string): string {
  if (!raw.trim()) return "";
  try {
    const url = new URL(raw.trim());
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password ||
        url.search || url.hash || (url.pathname !== "/" && url.pathname !== "") ||
        raw.includes("\\")) return "";
    return url.origin;
  } catch {
    return "";
  }
}

// Keep literal process.env access: Next replaces this public value at build time.
export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development" ? "http://127.0.0.1:8002" : ""),
);
export const isApiConfigured = API_BASE_URL.length > 0;
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const REQUEST_TIMEOUT = 20_000;
const UPLOAD_TIMEOUT = 90_000;

export function apiUrl(path: string): string {
  if (!isApiConfigured) {
    throw new ApiError("Layanan pemeriksaan belum terhubung.", 0, "configuration");
  }
  if (!path.startsWith("/") || path.startsWith("//") || /[\\\u0000-\u001f]/.test(path)) {
    throw new ApiError("Alamat permintaan tidak valid.", 0, "validation");
  }
  const url = new URL(path, API_BASE_URL);
  if (url.origin !== API_BASE_URL) {
    throw new ApiError("Alamat permintaan harus menuju layanan pemeriksaan.", 0, "validation");
  }
  return url.toString();
}

function jobPath(jobId: string): string {
  if (typeof jobId !== "string" || !jobId.trim() || jobId.length > 200 || /^\.+$/.test(jobId) ||
      /[\u0000-\u001f]/.test(jobId)) {
    throw new ApiError("Identitas pemeriksaan tidak valid.", 0, "validation");
  }
  return encodeURIComponent(jobId);
}

function invalidResponse(): never {
  throw new ApiError("Respons layanan belum lengkap. Coba periksa status lagi.", 502, "response");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

async function request<T>(path: string, options: {
  method?: "GET" | "POST";
  body?: BodyInit;
  signal?: AbortSignal;
  timeout?: number;
  blob?: boolean;
} = {}): Promise<T> {
  const url = apiUrl(path);
  const controller = new AbortController();
  const callerAbort = () => controller.abort();
  let timedOut = false;
  if (options.signal?.aborted) controller.abort();
  else options.signal?.addEventListener("abort", callerAbort, { once: true });
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, options.timeout ?? REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      body: options.body,
      signal: controller.signal,
      credentials: "omit",
      cache: "no-store",
    });
    if (!response.ok) {
      let message = "Permintaan belum berhasil. Silakan coba lagi.";
      try {
        const payload: unknown = await response.json();
        if (isRecord(payload) && typeof payload.detail === "string") message = payload.detail;
      } catch { /* HTML or empty error response: keep the readable fallback. */ }
      throw new ApiError(message, response.status);
    }
    if (options.blob) return await response.blob() as T;
    try {
      return await response.json() as T;
    } catch {
      return invalidResponse();
    }
  } catch (failure) {
    if (options.signal?.aborted) throw new DOMException("Request aborted", "AbortError");
    if (timedOut) throw new ApiError("Layanan terlalu lama merespons. Silakan coba lagi.", 408, "timeout");
    if (failure instanceof ApiError) throw failure;
    throw new ApiError("Layanan belum dapat dihubungi. Periksa koneksi lalu coba lagi.", 0, "network");
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener("abort", callerAbort);
  }
}

export function validatePdf(file: File): void {
  if (!file || !file.name.toLowerCase().endsWith(".pdf")) {
    throw new ApiError("Pilih file PDF untuk diperiksa.", 0, "validation");
  }
  if (file.size === 0) throw new ApiError("File kosong. Pilih PDF yang memiliki isi.", 0, "validation");
  if (file.size > MAX_UPLOAD_BYTES) throw new ApiError("File melebihi 50 MB.", 0, "validation");
}

export async function uploadFile(file: File, signal?: AbortSignal): Promise<UploadResponse> {
  validatePdf(file);
  const formData = new FormData();
  formData.append("file", file);
  const data: unknown = await request("/upload", { method: "POST", body: formData, signal, timeout: UPLOAD_TIMEOUT });
  if (!isRecord(data) || typeof data.job_id !== "string" || !data.job_id ||
      typeof data.original_filename !== "string" || typeof data.message !== "string") return invalidResponse();
  if (data.status !== "success") throw new ApiError(data.message, 200, "api_error");
  return data as UploadResponse;
}

function isCheckResult(value: unknown): value is CheckResult {
  if (!isRecord(value) || !["total_pages", "total_typos", "total_words", "total_foreign_words"].every(k => isCount(value[k])) ||
      typeof value.policy_version !== "string" || typeof value.resource_version !== "string" || !isRecord(value.evaluation)) return false;
  const summary = value.evaluation;
  return ["total_units", "spelling_findings_count", "italic_findings_count", "review_count", "not_assessed_units", "annotation_count"]
    .every(k => isCount(summary[k]));
}

export async function fetchProgress(jobId: string, signal?: AbortSignal): Promise<ProgressResponse> {
  const data: unknown = await request(`/progress/${jobPath(jobId)}`, { signal });
  if (!isRecord(data) || !["queued", "processing", "completed", "error"].includes(String(data.status)) ||
      !isCount(data.progress) || data.progress > 100) return invalidResponse();
  if (data.status === "completed" && !isCheckResult(data.result)) return invalidResponse();
  return data as ProgressResponse;
}

export type FindingsOptions = {
  type?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
};

export async function fetchFindings(jobId: string, options: FindingsOptions = {}): Promise<FindingsResponse> {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 20;
  const q = options.q?.trim() ?? "";
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 200 || q.length > 160 ||
      (options.type && !["spelling", "missing_italic", "review"].includes(options.type))) {
    throw new ApiError("Filter atau halaman temuan tidak valid.", 0, "validation");
  }
  const query = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (options.type) query.set("type", options.type);
  if (q) query.set("q", q);
  const data: unknown = await request(`/findings/${jobPath(jobId)}?${query}`, { signal: options.signal });
  if (!isRecord(data) || !isCount(data.total) || !isCount(data.page) || data.page < 1 || !isCount(data.page_size) || data.page_size < 1 ||
      !Array.isArray(data.items) || typeof data.schema_version !== "string" || typeof data.policy_version !== "string" ||
      typeof data.resource_version !== "string" || !data.items.every(item => isRecord(item) && typeof item.target === "string" &&
        isCount(item.page) && item.page >= 1)) return invalidResponse();
  return data as FindingsResponse;
}

export async function fetchExample(signal?: AbortSignal): Promise<File> {
  const blob = await request<Blob>("/ui/example.pdf", { signal, blob: true });
  const file = new File([blob], "contoh-laporan.pdf", { type: "application/pdf" });
  validatePdf(file);
  return file;
}

export async function downloadResult(jobId: string, fileName = "hasil-pemeriksaan.pdf", signal?: AbortSignal): Promise<void> {
  const blob = await request<Blob>(`/download/${jobPath(jobId)}`, { signal, blob: true });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  // Let the browser start reading before releasing the object URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
