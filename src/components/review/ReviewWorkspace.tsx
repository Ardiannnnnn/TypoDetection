"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import AppearanceToggle from "./AppearanceToggle";
import { ArrowDownToLine, ArrowRight, Check, ChevronLeft, ChevronRight, CircleHelp, ExternalLink, FileText, Search, Upload, X } from "lucide-react";
import { API_BASE_URL, ApiError, apiUrl, canUpload, fetchAccess, fetchExample, fetchFindings, fetchPreview, fetchProgress, isApiConfigured, uploadFile } from "@/service/uploadService";
import type { PublicAccess, UploadProgress } from "@/service/uploadService";
import type { CheckResult, FindingItem, FindingsResponse, ProgressResponse } from "@/types/upload";

type SavedJob = { id: string; name: string };
type Panel = "welcome" | "processing" | "results" | "error";
type Failure = { title: string; message: string; retry: boolean };
const pageSize = 20;

export default function ReviewWorkspace() {
  const locale = useLocale();
  const english = locale === "en";
  const say = (id: string, en: string) => english ? en : id;
  const number = (value: number) => new Intl.NumberFormat(english ? "en-US" : "id-ID").format(value);
  const storageKey = `typotrace.current-job:${API_BASE_URL}`;
  const [panel, setPanel] = useState<Panel>("welcome");
  const [file, setFile] = useState<File | null>(null);
  const [job, setJob] = useState<SavedJob | null>(null);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [connectionNote, setConnectionNote] = useState("");
  const [access, setAccess] = useState<PublicAccess | null>(null);
  const [accessState, setAccessState] = useState<"loading" | "ready" | "unavailable">("loading");
  const uploadEnabled = canUpload(access);
  const [failure, setFailure] = useState<Failure | null>(null);
  const [retry, setRetry] = useState(0);
  const [kind, setKind] = useState("");
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [findings, setFindings] = useState<FindingsResponse | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [listRetry, setListRetry] = useState(0);
  const [selected, setSelected] = useState("");
  const [pdfPage, setPdfPage] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTransfer, setPreviewTransfer] = useState<UploadProgress | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [previewRetry, setPreviewRetry] = useState(0);
  const previewJobId = job && result ? job.id : null;

  useEffect(() => {
    setPreviewUrl(null); setPreviewTransfer(null); setPreviewError(false);
    if (!previewJobId) return;
    const controller = new AbortController();
    let objectUrl: string | null = null;
    void fetchPreview(previewJobId, controller.signal, setPreviewTransfer).then(blob => {
      if (controller.signal.aborted) return;
      objectUrl = URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
    }).catch(() => { if (!controller.signal.aborted) setPreviewError(true); });
    return () => { controller.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [previewJobId, previewRetry]);
  const fileInput = useRef<HTMLInputElement>(null);
  const guide = useRef<HTMLDialogElement>(null);
  const guideOpener = useRef<HTMLButtonElement | null>(null);
  const uploadController = useRef<AbortController | null>(null);
  const operation = useRef(0);
  const resultTitle = useRef<HTMLHeadingElement>(null);
  const errorTitle = useRef<HTMLHeadingElement>(null);
  const previewPane = useRef<HTMLElement>(null);
  const findingsTitle = useRef<HTMLHeadingElement>(null);

  function remember(value: SavedJob | null) {
    try {
      if (value) sessionStorage.setItem(storageKey, JSON.stringify(value));
      else sessionStorage.removeItem(storageKey);
    } catch { /* Storage is optional. */ }
  }

  useEffect(() => {
    if (!isApiConfigured) return;
    const controller = new AbortController();
    async function refresh() {
      try {
        const value = await fetchAccess(controller.signal);
        setAccess(value); setAccessState("ready");
      } catch {
        if (!controller.signal.aborted) { setAccess(null); setAccessState("unavailable"); }
      }
    }
    void refresh();
    window.addEventListener("focus", refresh);
    return () => { controller.abort(); window.removeEventListener("focus", refresh); };
  }, []);

  useEffect(() => {
    if (!isApiConfigured || !uploadEnabled) return;
    try {
      const value = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (value && typeof value.id === "string" && value.id && typeof value.name === "string") {
        setJob({ id: value.id, name: value.name });
        setPanel("processing");
      }
    } catch { /* Ignore unavailable or invalid session storage. */ }
    return () => { operation.current += 1; uploadController.current?.abort(); };
  }, [storageKey, uploadEnabled]);

  useEffect(() => {
    const preventFileNavigation = (event: DragEvent) => {
      if (Array.from(event.dataTransfer?.types || []).includes("Files")) event.preventDefault();
    };
    window.addEventListener("dragover", preventFileNavigation);
    window.addEventListener("drop", preventFileNavigation);
    return () => {
      window.removeEventListener("dragover", preventFileNavigation);
      window.removeEventListener("drop", preventFileNavigation);
    };
  }, []);

  useEffect(() => {
    if (!job || panel !== "processing") return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let disposed = false;
    let attempts = 0;
    async function poll() {
      try {
        const data = await fetchProgress(job!.id, controller.signal);
        if (disposed) return;
        setProgress(data);
        setConnectionNote("");
        attempts = 0;
        if (data.status === "completed") {
          if (!data.result) throw new Error(say("Hasil pemeriksaan belum lengkap.", "The result is incomplete."));
          setResult(data.result);
          setPanel("results");
          return;
        }
        if (data.status === "error") {
          setFailure({ title: say("PDF belum dapat diproses.", "This PDF could not be processed."), message: data.message || data.error || say("Pastikan PDF dapat dibuka dan teksnya bisa dipilih.", "Check that the PDF opens and contains selectable text."), retry: false });
          setPanel("error");
          return;
        }
        timer = setTimeout(poll, 900);
      } catch (error) {
        if (disposed || (error instanceof Error && error.name === "AbortError")) return;
        if (error instanceof ApiError && [401, 404].includes(error.status)) {
          remember(null);
          setFailure({ title: say("Sesi pemeriksaan tidak tersedia.", "This review session is unavailable."), message: say("Sesi tidak tersedia di browser ini atau server sudah dimulai ulang. Pilih PDF baru untuk memulai lagi.", "The session is unavailable in this browser or the server restarted. Choose a new PDF to start again."), retry: false });
          setPanel("error");
        } else if (++attempts < 3) {
          setConnectionNote(say("Koneksi terputus. Memeriksa status kembali…", "Connection interrupted. Checking the status again…"));
          timer = setTimeout(poll, attempts * 1400);
        } else {
          setFailure({ title: say("Status belum dapat diambil.", "The status could not be retrieved."), message: say("Pemeriksaan mungkin masih berjalan. Periksa koneksi lalu cek status lagi.", "The review may still be running. Check your connection and try again."), retry: true });
          setPanel("error");
        }
      }
    }
    poll();
    return () => { disposed = true; clearTimeout(timer); controller.abort(); };
  }, [job, panel, retry, english]);

  useEffect(() => {
    if (panel === "results") resultTitle.current?.focus();
    if (panel === "error") errorTitle.current?.focus();
  }, [panel]);

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(query.trim()); setPage(1); }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!job || panel !== "results") return;
    const controller = new AbortController();
    let disposed = false;
    setListLoading(true);
    setListError("");
    fetchFindings(job.id, { type: kind, q: search, page, pageSize, signal: controller.signal }).then((data) => {
      if (!disposed) setFindings(data);
    }).catch((error) => {
      if (disposed || error?.name === "AbortError") return;
      setFindings(null);
      setListError(error instanceof ApiError && error.status === 404
        ? say("Sesi ini tidak tersedia. Unggah ulang dokumen untuk memulai lagi.", "This session is unavailable. Upload the document again.")
        : say("Daftar belum dapat dimuat. Periksa koneksi lalu coba lagi.", "The findings could not be loaded. Check your connection and retry."));
    }).finally(() => { if (!disposed) setListLoading(false); });
    return () => { disposed = true; controller.abort(); };
  }, [job, panel, kind, search, page, listRetry, english]);

  function reset() {
    operation.current += 1;
    uploadController.current?.abort();
    remember(null);
    setUploadProgress(null);
    setJob(null); setResult(null); setFile(null); setProgress(null); setBusy(false);
    setFailure(null); setFileError(""); setConnectionNote(""); setKind(""); setQuery("");
    setSearch(""); setPage(1); setPdfPage(1); setFindings(null); setSelected(""); setPanel("welcome");
    if (fileInput.current) fileInput.current.value = "";
  }

  function selectFile(value: File) {
    if (!uploadEnabled) return false;
    const problem = !value.name.toLowerCase().endsWith(".pdf")
      ? say("Pilih file PDF untuk diperiksa.", "Choose a PDF file to review.")
      : value.size === 0 ? say("File kosong. Pilih PDF yang memiliki isi.", "This file is empty. Choose another PDF.")
      : value.size > 500 * 1024 * 1024 ? say("File melebihi 500 MB.", "The file exceeds 500 MB.") : "";
    setFileError(problem); setFile(problem ? null : value);
    return !problem;
  }

  async function startUpload(value: File) {
    if (!uploadEnabled || !isApiConfigured || !selectFile(value)) return;
    uploadController.current?.abort();
    const controller = new AbortController();
    uploadController.current = controller;
    const current = ++operation.current;
    remember(null); setJob(null); setResult(null); setProgress(null); setFailure(null);
    setUploadProgress(null);
    setConnectionNote(""); setBusy(true); setPanel("processing");
    try {
      const uploaded = await uploadFile(value, controller.signal, data => {
        if (current === operation.current) setUploadProgress(data);
      });
      if (current !== operation.current) return;
      const saved = { id: uploaded.job_id, name: uploaded.original_filename || value.name };
      remember(saved); setJob(saved);
    } catch (error) {
      if (current !== operation.current || (error instanceof Error && error.name === "AbortError")) return;
      setFailure({ title: say("Unggahan belum berhasil.", "The upload was not completed."), message: error instanceof Error ? error.message : say("Periksa koneksi dan coba lagi.", "Check your connection and retry."), retry: false });
      setPanel("error");
    } finally { if (current === operation.current) setBusy(false); }
  }

  async function tryExample() {
    if (busy || !uploadEnabled || !isApiConfigured) return;
    uploadController.current?.abort();
    const controller = new AbortController(); uploadController.current = controller;
    const current = ++operation.current; setBusy(true); setFileError("");
    try {
      const example = await fetchExample(controller.signal);
      if (current !== operation.current) return;
      await startUpload(example);
    } catch (error) {
      if (current === operation.current && !(error instanceof Error && error.name === "AbortError")) {
        setFileError(say("Dokumen contoh belum dapat dimuat. Coba lagi atau pilih PDF Anda sendiri.", "The sample is unavailable. Retry or choose your own PDF."));
      }
    } finally { if (current === operation.current) setBusy(false); }
  }

  function openGuide(event: React.MouseEvent<HTMLButtonElement>) { guideOpener.current = event.currentTarget; guide.current?.showModal(); }
  function closeGuide() { guide.current?.close(); guideOpener.current?.focus(); }
  function chooseFinding(item: FindingItem, id: string) {
    setSelected(id);
    setPdfPage(Number.isInteger(item.page) && item.page >= 1 && item.page <= (result?.total_pages || 1) ? item.page : 1);
    if (window.matchMedia("(max-width: 900px)").matches) {
      previewPane.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }
  }

  function changeView(value: string, fromSummary = false) {
    setKind(value); setPage(1); setSelected("");
    if (fromSummary) {
      setQuery(""); setSearch("");
      findingsTitle.current?.focus({ preventScroll: true });
    }
  }

  const uploadPercent = uploadProgress?.total ? Math.min(100, Math.floor(uploadProgress.loaded / uploadProgress.total * 100)) : undefined;
  const queued = progress?.status === "queued";
  const displayedPercent = job ? progress?.progress : uploadPercent;
  const megabytes = (bytes: number) => new Intl.NumberFormat(english ? "en-US" : "id-ID", { maximumFractionDigits: 2 }).format(bytes / 1024 / 1024);
  const elapsed = typeof progress?.elapsed_time === "number" ? Math.floor(progress.elapsed_time) : null;
  const elapsedLabel = elapsed === null ? null : `${Math.floor(elapsed / 60).toString().padStart(2, "0")}:${(elapsed % 60).toString().padStart(2, "0")}`;

  const preview = previewUrl ? `${previewUrl}#page=${pdfPage}&view=FitH&navpanes=0` : undefined;
  const summary = result?.evaluation;
  const total = findings?.total || 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const labels: Record<string, string> = { spelling: say("Ejaan", "Spelling"), missing_italic: say("Belum miring", "Missing italics"), review: say("Perlu ditinjau", "Needs review") };
  const filename = job?.name || file?.name || "";

  const categories = [
    { type: "spelling", color: "red", symbol: "Aa", count: summary?.spelling_findings_count || 0, label: say("Ejaan", "Spelling") },
    { type: "missing_italic", color: "blue", symbol: "a", count: summary?.italic_findings_count || 0, label: say("Belum miring", "Missing italics") },
    { type: "review", color: "neutral", symbol: "?", count: summary?.review_count || 0, label: say("Perlu ditinjau", "Needs review") },
  ];

  return <>
    <a className="skip-link" href="#main">{say("Lewati navigasi", "Skip navigation")}</a>
    <header className="toolbar">
      <a className="brand" href={`/${locale}`} aria-label="Check Your Paper"><FileText aria-hidden="true"/><span className="brand-wordmark"><strong>Check</strong><span>your paper</span></span></a>
      <div className="toolbar-actions">
        <AppearanceToggle english={english}/>
        <a className="locale-link" href={`/${english ? "id" : "en"}/upload`} aria-label={say("Switch to English", "Ganti ke Bahasa Indonesia")}>{english ? "ID" : "EN"}</a>
        <button className="help-button" onClick={openGuide} aria-label={say("Buka panduan", "Open review guide")}><CircleHelp/></button>
        {panel !== "welcome" && panel !== "processing" && <button className="button secondary new-document" onClick={reset}>{say("PDF baru", "New PDF")}</button>}
      </div>
    </header>
    <main id="main" className={`page page-${panel}`} tabIndex={-1}>
      {panel === "welcome" && <section className="welcome">
        <div className="intro"><h1>{say("Periksa laporan Anda.", "Review your report.")}</h1><p>{say("Temukan dugaan salah ejaan dan istilah yang belum miring.", "Find possible spelling issues and terms that need italics.")}</p></div>
        {!isApiConfigured && <p className="service-notice" role="status">{say("Layanan pemeriksaan belum terhubung.", "The review service is not connected yet.")}</p>}
        {isApiConfigured && !uploadEnabled && <p className="service-notice" role="status">{accessState === "loading"
          ? say("Memeriksa ketersediaan layanan…", "Checking service availability…")
          : accessState === "unavailable"
          ? say("Layanan belum dapat dihubungi. Unggahan sementara dinonaktifkan.", "The service is unavailable. Uploads are temporarily disabled.")
          : say("Pemeriksaan belum dibuka untuk publik. Tidak ada berkas yang diunggah.", "Public reviews are not available yet. No files are uploaded.")}</p>}
        <div className="upload-panel">
          <div className={`dropzone${dragging ? " dragging" : ""}`} role="group" aria-label={say("Unggah dokumen PDF", "Upload a PDF")}
            onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
            onDrop={event => { event.preventDefault(); setDragging(false); const files = event.dataTransfer.files; if (files.length > 1) setFileError(say("Pilih satu PDF untuk setiap pemeriksaan.", "Choose one PDF per review.")); else if (files[0] && isApiConfigured) selectFile(files[0]); }}>
            <input ref={fileInput} id="fileInput" className="visually-hidden" tabIndex={-1} type="file" accept=".pdf,application/pdf" disabled={!uploadEnabled || busy} aria-label={say("Pilih dokumen PDF", "Choose a PDF file")} onChange={event => { if (event.target.files?.[0]) selectFile(event.target.files[0]); }}/>
            {file ? <div className="file-selection"><FileText className="document-icon" aria-hidden="true"/><h2>{file.name}</h2><p>{number(Math.max(1, Math.round(file.size / 1024)))} KB</p><button className="text-button" disabled={busy} onClick={() => fileInput.current?.click()}>{say("Ganti PDF", "Choose another PDF")}</button></div>
              : <div className="drop-prompt"><Upload className="upload-icon" aria-hidden="true"/><h2>{say("Taruh PDF di sini", "Drop your PDF here")}</h2><button className="button primary" disabled={!uploadEnabled || busy} onClick={() => fileInput.current?.click()}>{say("Pilih PDF", "Choose PDF")}<ArrowRight/></button><p className="file-hint">{say("PDF dengan teks · Maks. 500 MB", "Text-based PDF · Up to 500 MB")}</p></div>}
          </div>
          {fileError && <p className="inline-error" role="alert">{fileError}</p>}
          {file && <button className="button primary start-button" disabled={busy || !uploadEnabled} onClick={() => startUpload(file)}>{say("Periksa PDF", "Review PDF")}<ArrowRight/></button>}
        </div>
        {uploadEnabled ? <button className="example-button" disabled={busy} onClick={tryExample}>{busy ? say("Menyiapkan contoh…", "Preparing sample…") : say("Coba dengan PDF contoh", "Try a sample PDF")}</button>
          : <a className="example-button" href={`/${locale}#example`}>{say("Lihat contoh hasil", "View sample results")}</a>}
      </section>}

      {panel === "processing" && <section className="processing-panel" aria-labelledby="processingTitle">
        <span className="spinner" aria-hidden="true"/>
        <h1 id="processingTitle">{job
          ? queued ? say("Menunggu antrean…", "Waiting in queue…") : say("Memeriksa PDF…", "Reviewing your PDF…")
          : uploadPercent === 100 ? say("Menunggu server…", "Waiting for the server…") : say("Mengunggah PDF…", "Uploading your PDF…")}</h1>
        <p className="processing-filename">{filename}</p>
        <div className="progress-wrap"><progress max={100} value={displayedPercent} aria-label={job ? say("Progres pemeriksaan", "Review progress") : say("Progres unggahan", "Upload progress")}/><span>{displayedPercent === undefined ? "—" : `${Math.round(displayedPercent)}%`}</span></div>
        {!job && uploadProgress && <p className="processing-filename">{say("Terkirim", "Sent")} <strong>{megabytes(uploadProgress.loaded)}{uploadProgress.total ? ` / ${megabytes(uploadProgress.total)}` : ""} MB</strong></p>}
        {job && queued && progress.queue_position && <p className="processing-filename">{say("Posisi antrean", "Queue position")} <strong>{number(progress.queue_position)}</strong></p>}
        {job && !queued && (progress?.total_pages || 0) > 0 && <p className="processing-filename">{say("Halaman", "Page")} <strong>{number(progress?.current_page || 0)} / {number(progress?.total_pages || 0)}</strong></p>}
        {job && elapsedLabel && <p className="processing-filename">{say("Waktu pemeriksaan", "Processing time")} <strong>{elapsedLabel}</strong></p>}
        <p id="processingMessage" role="status" aria-live="polite">{connectionNote || (job ? progress?.message || say("Mengambil status server…", "Fetching server status…") : uploadPercent === 100 ? say("Data terkirim. Menunggu konfirmasi server; PDF belum selesai diperiksa.", "Data sent. Waiting for server confirmation; the PDF has not finished processing.") : say("Mengirim data dari browser ke server.", "Sending data from your browser to the server."))}</p>
      </section>}

      {panel === "error" && failure && <section className="error-panel"><span className="error-symbol" aria-hidden="true">!</span><h1 ref={errorTitle} tabIndex={-1}>{failure.title}</h1><p role="alert">{failure.message}</p><div className="error-actions">{failure.retry && <button className="button primary" onClick={() => { setConnectionNote(""); setRetry(v => v + 1); setPanel("processing"); }}>{say("Cek status lagi", "Check status again")}</button>}<button className="button secondary" onClick={reset}>{say("Pilih PDF lain", "Choose another PDF")}</button></div></section>}

      {panel === "results" && job && result && <section className="results" aria-labelledby="resultTitle">
        <div className="result-heading"><div><div className="completed-label"><Check aria-hidden="true"/>{say("Selesai diperiksa", "Review complete")}</div><h1 id="resultTitle" ref={resultTitle} tabIndex={-1}>{filename}</h1><p>{number(result.total_pages)} {say("halaman", "pages")}</p></div><div className="result-actions"><a className="button secondary" href={apiUrl(`/report/${encodeURIComponent(job.id)}`)} target="_blank" rel="noopener">{say("Laporan lengkap", "Full report")}</a><a className="button primary" href={apiUrl(`/download/${encodeURIComponent(job.id)}`)}><ArrowDownToLine/>{say("Unduh PDF", "Download PDF")}</a></div></div>
        <div className="summary-strip" role="group" aria-label={say("Pilih jenis temuan", "Choose finding type")}>
          {categories.map(category => <button key={category.type} className={`summary-card ${category.color}`} aria-pressed={kind === category.type} onClick={() => changeView(category.type, true)}><span className={`summary-symbol ${category.color}`} aria-hidden="true">{category.symbol}</span><strong>{number(category.count)}</strong><span className="summary-label">{category.label}</span><ChevronRight aria-hidden="true"/></button>)}
        </div>
        {!!result.coverage?.unreadable_pages && <p className="coverage-note">{number(result.coverage.unreadable_pages)} {say("halaman tidak memiliki teks yang dapat dibaca dan belum diperiksa.", "pages have no readable text and could not be reviewed.")}</p>}
        <div className="review-workspace">
          <section ref={previewPane} className="preview-pane" aria-labelledby="previewHeading">
            <div className="pane-title"><h2 id="previewHeading">{say("Hasil Pemeriksaan", "Review Results")}</h2><a className="text-button" href={preview} target="_blank" rel="noopener">{say("Buka PDF", "Open PDF")}<ExternalLink/></a></div>
            <div className="preview-canvas">{preview ? <iframe key={`${job.id}-${pdfPage}`} src={preview} title={say("Pratinjau PDF hasil pemeriksaan", "Reviewed PDF preview")}/> : <div className="processing-panel" role="status">
              {previewError ? <><p>{say("Pratinjau belum dapat dimuat.", "The preview could not be loaded.")}</p><button className="button secondary" onClick={() => setPreviewRetry(value => value + 1)}>{say("Muat ulang pratinjau", "Retry preview")}</button></> : <><p>{say("Memuat PDF…", "Loading PDF…")}</p><progress max={previewTransfer?.total || undefined} value={previewTransfer?.total ? previewTransfer.loaded : undefined} aria-label={say("Unduhan pratinjau PDF", "PDF preview download")}/>{previewTransfer && <p><strong>{megabytes(previewTransfer.loaded)}{previewTransfer.total ? ` / ${megabytes(previewTransfer.total)}` : ""} MB</strong></p>}</>}
            </div>}</div>
            <div className="pdf-pagination"><button className="icon-button" disabled={pdfPage <= 1} onClick={() => setPdfPage(p => Math.max(1, p - 1))} aria-label={say("Halaman PDF sebelumnya", "Previous PDF page")}><ChevronLeft/></button><span>{say("Halaman", "Page")} {pdfPage} / {result.total_pages}</span><button className="icon-button" disabled={pdfPage >= result.total_pages} onClick={() => setPdfPage(p => Math.min(result.total_pages, p + 1))} aria-label={say("Halaman PDF berikutnya", "Next PDF page")}><ChevronRight/></button></div>
          </section>
          <section className="findings-pane" aria-labelledby="findingsHeading">
            <div className="pane-title"><h2 id="findingsHeading" ref={findingsTitle} tabIndex={-1}>{say("Temuan", "Findings")}</h2><span>{listLoading ? "…" : number(total)}</span></div>
            <div className="filters" role="group" aria-label={say("Jenis temuan", "Finding type")}>{[["", say("Ditandai", "Highlighted")], ["spelling", say("Ejaan", "Spelling")], ["missing_italic", say("Miring", "Italics")], ["review", say("Tinjau", "Review")]].map(([value, label]) => <button key={value} className={`filter${kind === value ? " active" : ""}`} aria-pressed={kind === value} onClick={() => changeView(value)}>{label}</button>)}</div>
            <label className="search"><Search aria-hidden="true"/><input type="search" value={query} maxLength={160} onChange={event => setQuery(event.target.value)} placeholder={say("Cari kata…", "Find a word…")} aria-label={say("Cari pada seluruh temuan", "Search all findings")}/></label>
            <p className="list-status" role="status" aria-live="polite">{listLoading ? say("Memuat…", "Loading…") : listError || (search ? `${number(total)} ${say("hasil", "results")}` : "")}</p>
            <div className="findings-list" aria-busy={listLoading}>
              {!listError && findings?.items.map((item, index) => {
                const id = item.finding_id || item.unit_id || `${item.page}-${index}`;
                const type = item.type || "review";
                return <button key={id} className="finding" data-type={type} aria-pressed={selected === id} onClick={() => chooseFinding(item, id)}>
                  <span className="finding-top"><span className="finding-target">{item.target || say("Bagian dokumen", "Document section")}</span><span className="finding-page">{say("Hlm.", "Pg.")} {item.page}<ChevronRight aria-hidden="true"/></span></span>
                  <span className="finding-kind">{labels[type] || labels.review}</span>
                  {selected === id && <span className="finding-message">{item.message || item.review_reasons?.join(" ") || say("Periksa bagian ini dalam konteks kalimatnya.", "Check this part in the context of its sentence.")}</span>}
                </button>;
              })}
              {!listLoading && !listError && !findings?.items.length && <div className="empty-list"><Search aria-hidden="true"/><strong>{search ? say("Tidak ditemukan", "No matches") : say("Tidak ada temuan di kategori ini", "No findings in this category")}</strong>{search && <button className="text-button" onClick={() => setQuery("")}>{say("Hapus pencarian", "Clear search")}</button>}</div>}
              {listError && <div className="empty-list"><button className="button secondary" onClick={() => setListRetry(v => v + 1)}>{say("Coba lagi", "Try again")}</button></div>}
            </div>
            <div className="pagination"><button className="icon-button" disabled={page <= 1 || listLoading} aria-label={say("Halaman temuan sebelumnya", "Previous findings page")} onClick={() => setPage(p => Math.max(1, p - 1))}><ChevronLeft/></button><span>{page} / {pages}</span><button className="icon-button" disabled={page >= pages || listLoading} aria-label={say("Halaman temuan berikutnya", "Next findings page")} onClick={() => setPage(p => p + 1)}><ChevronRight/></button></div>
          </section>
        </div>
      </section>}
    </main>
    <dialog ref={guide} aria-labelledby="guideTitle" onCancel={event => { event.preventDefault(); closeGuide(); }}>
      <div className="dialog-heading"><h2 id="guideTitle">{say("Membaca hasil pemeriksaan", "Understanding your results")}</h2><button className="icon-button" onClick={closeGuide} aria-label={say("Tutup panduan", "Close guide")}><X/></button></div>
      {[["red", "Aa", say("Ejaan", "Spelling"), say("Kandidat salah tulis ditandai merah. Klik temuan, cocokkan dengan kalimatnya, lalu perbaiki di dokumen sumber bila sesuai.", "Possible spelling issues are highlighted red. Select a finding, check its sentence, then edit your source document if appropriate.")], ["blue", "a", say("Belum miring", "Missing italics"), say("Istilah yang diduga perlu huruf miring ditandai biru. Periksa konteksnya sebelum mengubah format.", "Terms that may need italics are highlighted blue. Check their context before changing formatting.")], ["neutral", "?", say("Perlu ditinjau", "Needs review"), say("Buktinya belum cukup. Bagian ini tidak ditandai merah atau biru; kata tidak dikenal belum tentu salah.", "Evidence is insufficient. These parts are not highlighted red or blue; unfamiliar words are not necessarily wrong.")]].map(([color, symbol, title, description]) => <div className="guide-row" key={color}><span className={`summary-symbol ${color}`} aria-hidden="true">{symbol}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}
      <div className="guide-note">{say("Pemeriksaan masih terbatas dan belum mendukung PDF scan. Hasil tanpa temuan tidak menjamin seluruh tulisan sudah benar. PDF asli tetap utuh; hasilnya berupa salinan.", "The review has limited coverage and does not support scanned PDFs. No findings does not guarantee correct writing. Your original PDF stays unchanged; results are saved as a copy.")}</div>
      {result && <dl className="review-details"><div><dt>{say("Kebijakan", "Policy")}</dt><dd>{result.policy_version}</dd></div><div><dt>{say("Sumber", "Resources")}</dt><dd>{result.resource_version}</dd></div></dl>}
      <button className="button primary" onClick={closeGuide}>{say("Mengerti", "Understood")}</button>
    </dialog>
  </>;
}
