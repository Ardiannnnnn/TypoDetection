"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { ArrowDownToLine, ArrowRight, Check, ChevronLeft, ChevronRight, CircleHelp, ExternalLink, FileText, Info, Search, Upload, X } from "lucide-react";
import { API_BASE_URL, ApiError, apiUrl, fetchExample, fetchFindings, fetchProgress, isApiConfigured, uploadFile } from "@/service/uploadService";
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
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState("");
  const [connectionNote, setConnectionNote] = useState("");
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
  const fileInput = useRef<HTMLInputElement>(null);
  const guide = useRef<HTMLDialogElement>(null);
  const guideOpener = useRef<HTMLButtonElement | null>(null);
  const uploadController = useRef<AbortController | null>(null);
  const operation = useRef(0);
  const resultTitle = useRef<HTMLHeadingElement>(null);
  const errorTitle = useRef<HTMLHeadingElement>(null);

  function remember(value: SavedJob | null) {
    try {
      if (value) sessionStorage.setItem(storageKey, JSON.stringify(value));
      else sessionStorage.removeItem(storageKey);
    } catch { /* Storage is optional. */ }
  }

  useEffect(() => {
    if (!isApiConfigured) return;
    try {
      const value = JSON.parse(sessionStorage.getItem(storageKey) || "null");
      if (value && typeof value.id === "string" && value.id && typeof value.name === "string") {
        setJob({ id: value.id, name: value.name });
        setPanel("processing");
      }
    } catch { /* Ignore unavailable or invalid session storage. */ }
    return () => { operation.current += 1; uploadController.current?.abort(); };
  }, [storageKey]);

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
        if (error instanceof ApiError && error.status === 404) {
          setFailure({ title: say("Sesi pemeriksaan tidak tersedia.", "This review session is unavailable."), message: say("Server mungkin sudah dimulai ulang. Unggah kembali PDF untuk memulai pemeriksaan baru.", "The server may have restarted. Upload your PDF again to start a new review."), retry: false });
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
    setJob(null); setResult(null); setFile(null); setProgress(null); setBusy(false);
    setFailure(null); setFileError(""); setConnectionNote(""); setKind(""); setQuery("");
    setSearch(""); setPage(1); setPdfPage(1); setFindings(null); setSelected(""); setPanel("welcome");
    if (fileInput.current) fileInput.current.value = "";
  }

  function selectFile(value: File) {
    const problem = !value.name.toLowerCase().endsWith(".pdf")
      ? say("Pilih file PDF untuk diperiksa.", "Choose a PDF file to review.")
      : value.size === 0 ? say("File kosong. Pilih PDF yang memiliki isi.", "This file is empty. Choose another PDF.")
      : value.size > 50 * 1024 * 1024 ? say("File melebihi 50 MB.", "The file exceeds 50 MB.") : "";
    setFileError(problem); setFile(problem ? null : value);
    return !problem;
  }

  async function startUpload(value: File) {
    if (!isApiConfigured || !selectFile(value)) return;
    uploadController.current?.abort();
    const controller = new AbortController();
    uploadController.current = controller;
    const current = ++operation.current;
    remember(null); setJob(null); setResult(null); setProgress(null); setFailure(null);
    setConnectionNote(""); setBusy(true); setPanel("processing");
    try {
      const uploaded = await uploadFile(value, controller.signal);
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
    if (busy || !isApiConfigured) return;
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
  function chooseFinding(item: FindingItem) {
    setSelected(item.finding_id || item.unit_id || "");
    setPdfPage(Number.isInteger(item.page) && item.page >= 1 && item.page <= (result?.total_pages || 1) ? item.page : 1);
  }

  const preview = job && result ? `${apiUrl(`/preview/${encodeURIComponent(job.id)}`)}#page=${pdfPage}&view=FitH&navpanes=0` : undefined;
  const summary = result?.evaluation;
  const total = findings?.total || 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const labels: Record<string, string> = { spelling: say("Ejaan", "Spelling"), missing_italic: say("Belum italic", "Missing italic"), review: say("Perlu ditinjau", "Needs review") };
  const filename = job?.name || file?.name || "";

  return <>
    <a className="skip-link" href="#main">{say("Lewati navigasi", "Skip navigation")}</a>
    <aside className="sidebar" aria-label={say("Navigasi utama", "Main navigation")}>
      <a className="brand" href={`/${locale}`} aria-label="TypoTrace"><FileText aria-hidden="true"/><span>TypoTrace<span className="brand-dot">.</span></span></a>
      <p className="sidebar-description">{say("Ruang tinjau laporan", "Document review workspace")}</p>
      <nav className="navigation"><a className="nav-item active" href={`/${locale}`} aria-current="page"><FileText/>{say("Pemeriksaan", "Review")}</a><button className="nav-item" onClick={openGuide}><CircleHelp/>{say("Cara membaca hasil", "Understanding findings")}</button></nav>
      {filename && <div className="current-document"><span className="sidebar-label">{say("Dokumen saat ini", "Current document")}</span><div className="current-document-row"><span className="small-document" aria-hidden="true">PDF</span><span title={filename}>{filename}</span></div></div>}
      <div className="sidebar-bottom"><span className="edition">{say("Versi eksperimen", "Experimental release")}</span><p>{say("Temuan adalah bantuan tinjau, bukan keputusan akhir.", "Findings support your review. They are not a final assessment.")}</p></div>
    </aside>
    <div className="app-shell">
      <header className="toolbar"><span className="toolbar-title">{say("Pemeriksaan dokumen", "Document review")}</span><div className="toolbar-actions"><a className="locale-link" href={`/${english ? "id" : "en"}`} aria-label={say("Switch to English", "Ganti ke Bahasa Indonesia")}>{english ? "ID" : "EN"}</a>{panel !== "welcome" && panel !== "processing" && <button className="button quiet" onClick={reset}>{say("Dokumen baru", "New document")}</button>}<button className="help-button" onClick={openGuide} aria-label={say("Buka panduan", "Open review guide")}><CircleHelp/></button></div></header>
      <main id="main" tabIndex={-1}>
        {panel === "welcome" && <section className="welcome">
          <div className="intro"><h1>{say("Periksa laporan Anda.", "A closer look at your report.")}</h1><p>{say("Temukan dugaan salah tulis dan bagian asing yang belum italic.", "Find possible spelling issues and foreign terms that need italics.")}<br className="desktop-break"/>{say(" Mulai dari PDF, lalu tinjau setiap temuan.", " Start with a PDF, then review each finding.")}</p></div>
          {!isApiConfigured && <p className="service-notice" role="status">{say("Layanan pemeriksaan belum terhubung. Silakan kembali setelah layanan tersedia.", "The review service is not connected yet. Please return when the service is available.")}</p>}
          <div className="intake-grid"><div className="upload-panel">
            <div className={`dropzone${dragging ? " dragging" : ""}`} role="group" aria-label={say("Unggah dokumen PDF", "Upload a PDF")}
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); const files=event.dataTransfer.files; if (files.length>1) setFileError(say("Pilih satu PDF untuk setiap pemeriksaan.", "Choose one PDF per review.")); else if (files[0] && isApiConfigured) selectFile(files[0]); }}>
              <input ref={fileInput} id="fileInput" className="visually-hidden" tabIndex={-1} type="file" accept=".pdf,application/pdf" disabled={!isApiConfigured || busy} aria-label={say("Pilih dokumen PDF", "Choose a PDF file")} onChange={(event) => { if(event.target.files?.[0]) selectFile(event.target.files[0]); }}/>
              {file ? <div className="file-selection"><span className="file-icon" aria-hidden="true">PDF</span><h2>{file.name}</h2><p>{number(Math.max(1,Math.round(file.size/1024)))} KB</p><button className="text-button" disabled={busy} onClick={() => fileInput.current?.click()}>{say("Ganti dokumen", "Choose another file")}</button></div>
                : <div className="drop-prompt"><div className="upload-symbol"><Upload/></div><h2>{say("Satu PDF untuk mulai.", "One PDF to get started.")}</h2><p>{say("Seret dokumen ke sini, atau pilih dari perangkat Anda.", "Drop your document here, or choose one from your device.")}</p><button className="button secondary" disabled={!isApiConfigured || busy} onClick={() => fileInput.current?.click()}>{say("Pilih PDF", "Choose PDF")}</button><span className="file-hint">{say("Maksimum 50 MB. PDF dengan teks.", "Up to 50 MB. PDFs with selectable text.")}</span></div>}
            </div>
            {fileError && <p className="inline-error" role="alert">{fileError}</p>}
            <button className="button primary start-button" disabled={!file || busy || !isApiConfigured} onClick={() => file && startUpload(file)}>{say("Periksa dokumen", "Review document")}<ArrowRight/></button>
            <button className="example-button" disabled={busy || !isApiConfigured} onClick={tryExample}><FileText/>{busy ? say("Menyiapkan contoh…", "Preparing sample…") : say("Coba dokumen contoh", "Try a sample document")}</button>
          </div><figure className="paper-scene" aria-label={say("Contoh penandaan merah dan biru", "Example red and blue annotations")}><div className="paper-shadow"/><div className="example-paper"><div className="paper-running-head">{say("Laporan penelitian", "Research report")}</div><h3>Metode Penelitian</h3><p>Penelitian ini membahas pengembangan sistem untuk membantu proses peninjauan laporan.</p><p>Tahap <mark className="typo-mark">impelementasi</mark> dilakukan setelah kebutuhan sistem ditentukan.</p><p>Analisis data menggunakan pendekatan <mark className="italic-mark">machine learning</mark> untuk mendukung penelitian.</p><div className="paper-rule"/><div className="paper-page">12</div></div><figcaption>{say("Contoh penandaan, bukan hasil dokumen Anda.", "Illustration only, not the result of your document.")}</figcaption></figure></div>
          <div className="legend-line"><span><i className="legend-dot red"/>{say("Dugaan salah tulis", "Possible spelling issue")}</span><span><i className="legend-dot blue"/>{say("Bagian belum italic", "Missing italics")}</span><span><i className="legend-dot gray"/>{say("Belum jelas, perlu ditinjau", "Uncertain, needs review")}</span></div>
        </section>}

        {panel === "processing" && <section className="processing-panel" aria-labelledby="processingTitle"><div className="processing-icon" aria-hidden="true"><span className="spinner"/></div><h1 id="processingTitle">{job ? say("Memeriksa dokumen…", "Reviewing your document…") : say("Mengunggah dokumen…", "Uploading your document…")}</h1><p className="processing-filename">{filename}</p><div className="progress-wrap"><progress max={100} value={job ? Math.min(100,Math.max(0,progress?.progress || 0)) : undefined} aria-label={say("Progres pemeriksaan", "Review progress")}/><span>{job ? `${Math.round(progress?.progress || 0)}%` : ""}</span></div><p id="processingMessage" role="status" aria-live="polite">{connectionNote || progress?.message || say("Menyiapkan PDF untuk pemeriksaan.", "Preparing the PDF for review.")}</p><span className="secondary-text">{progress?.total_pages ? `${say("Halaman", "Page")} ${number(progress.current_page || 0)} / ${number(progress.total_pages)}` : say("Menyiapkan halaman dokumen.", "Preparing document pages.")}</span><p className="processing-note">{say("Dokumen asli tetap utuh. Hasil dibuat sebagai salinan.", "The original stays unchanged. Results are saved as a separate copy.")}</p></section>}

        {panel === "error" && failure && <section className="error-panel"><span className="error-symbol" aria-hidden="true">!</span><h1 ref={errorTitle} tabIndex={-1}>{failure.title}</h1><p role="alert">{failure.message}</p><div className="error-actions">{failure.retry && <button className="button primary" onClick={() => { setConnectionNote(""); setRetry(v=>v+1); setPanel("processing"); }}>{say("Cek status lagi", "Check status again")}</button>}<button className="button secondary" onClick={reset}>{say("Pilih PDF lain", "Choose another PDF")}</button></div></section>}

        {panel === "results" && job && result && <section className="results" aria-labelledby="resultTitle"><div className="result-heading"><div><div className="completed-label"><Check/>{say("Pemeriksaan selesai", "Review complete")}</div><h1 id="resultTitle" ref={resultTitle} tabIndex={-1}>{filename}</h1><p>{number(result.total_pages)} {say("halaman", "pages")}, {number(result.total_words)} {say("kata dibaca", "words read")}</p></div><div className="result-actions"><a className="button secondary" href={apiUrl(`/report/${encodeURIComponent(job.id)}`)} target="_blank" rel="noopener">{say("Buka laporan", "Open report")}</a><a className="button primary" href={apiUrl(`/download/${encodeURIComponent(job.id)}`)}><ArrowDownToLine/>{say("Unduh PDF", "Download PDF")}</a></div></div>
          <div className="summary-strip" aria-label={say("Ringkasan temuan", "Findings summary")}>{[["red","Aa",summary?.spelling_findings_count || 0,say("Dugaan typo","Spelling issues")],["blue","a",summary?.italic_findings_count || 0,say("Belum italic","Missing italics")],["neutral","?",summary?.review_count || 0,say("Perlu ditinjau","Needs review")]].map(([color,symbol,count,label])=><div key={String(color)}><span className={`summary-symbol ${color}`}>{symbol}</span><div><strong>{number(Number(count))}</strong><span>{label}</span></div></div>)}</div>
          {!!result.coverage?.unreadable_pages && <p className="coverage-note">{number(result.coverage.unreadable_pages)} {say("halaman tidak memiliki teks yang dapat dibaca dan belum diperiksa.", "pages have no readable text and could not be reviewed.")}</p>}
          <div className="review-workspace"><section className="findings-pane" aria-labelledby="findingsHeading"><div className="pane-title"><h2 id="findingsHeading">{say("Temuan", "Findings")}</h2><span>{number(total)} {say("bagian", "items")}</span></div><div className="filters" role="group" aria-label={say("Jenis temuan", "Finding type")}>{[["",say("Semua","All")],["spelling",say("Typo","Spelling")],["missing_italic","Italic"],["review",say("Tinjau","Review")]].map(([value,label])=><button key={value} className={`filter${kind===value?" active":""}`} aria-pressed={kind===value} onClick={()=>{setKind(value);setPage(1);}}>{label}</button>)}</div><label className="search"><Search/><input type="search" value={query} maxLength={160} onChange={event=>setQuery(event.target.value)} placeholder={say("Cari kata atau frasa", "Find a word or phrase")} aria-label={say("Cari pada seluruh temuan", "Search all findings")}/></label><p className="list-status" role="status" aria-live="polite">{listLoading ? say("Memuat temuan…","Loading findings…") : listError || (search ? `${number(total)} ${say("hasil pencarian.","search results.")}` : "")}</p>
            <div className="findings-list" aria-busy={listLoading}>{!listError && findings?.items.map((item,index)=>{const id=item.finding_id||item.unit_id||`${item.page}-${index}`; const type=item.type||"review";return <button key={id} className="finding" data-type={type} aria-pressed={selected===id} onClick={()=>chooseFinding(item)}><span className="finding-top"><span className="finding-target">{item.target || say("Bagian dokumen","Document section")}</span><span className="finding-page">{say("Hlm.","Pg.")} {item.page}</span></span><span className="finding-kind">{labels[type]||labels.review}</span><p className="finding-message">{item.message || item.review_reasons?.join(" ") || say("Tinjau bagian ini pada dokumen.","Review this section in your document.")}</p></button>;})}{!listLoading && !listError && !findings?.items.length && <div className="empty-list"><strong>{search ? say("Belum ada yang cocok.","No matching findings.") : say("Tidak ada temuan pada pilihan ini.","No findings in this view.")}</strong><p>{search ? say("Coba kata lain atau hapus pencarian.","Try another word or clear the search.") : say("Tidak adanya highlight bukan jaminan semua tulisan benar.","No highlights does not guarantee that all writing is correct.")}</p></div>}{listError && <div className="empty-list"><p>{listError}</p><button className="button secondary list-retry" onClick={()=>setListRetry(v=>v+1)}>{say("Muat ulang daftar","Retry findings")}</button></div>}</div>
            <div className="pagination"><button className="icon-button" disabled={page<=1||listLoading} aria-label={say("Halaman sebelumnya","Previous findings page")} onClick={()=>setPage(p=>Math.max(1,p-1))}><ChevronLeft/></button><span>{page} {say("dari","of")} {pages}</span><button className="icon-button" disabled={page>=pages||listLoading} aria-label={say("Halaman berikutnya","Next findings page")} onClick={()=>setPage(p=>p+1)}><ChevronRight/></button></div></section>
            <section className="preview-pane" aria-labelledby="previewHeading"><div className="pane-title"><h2 id="previewHeading">{say("PDF hasil", "Reviewed PDF")}</h2><a className="text-button" href={preview} target="_blank" rel="noopener">{say("Buka PDF", "Open PDF")}<ExternalLink/></a></div><div className="preview-canvas"><iframe src={preview} title={say("Pratinjau PDF hasil pemeriksaan", "Reviewed PDF preview")}/></div><p className="preview-note">{say("Pilih temuan untuk membuka halamannya. Jika pratinjau tidak tampil, gunakan Buka PDF.", "Select a finding to open its page. If the preview is unavailable, use Open PDF.")}</p></section></div>
          <details className="diagnostics"><summary>{say("Detail pemeriksaan", "Review details")}</summary><dl>{[[say("Versi kebijakan","Policy version"),result.policy_version],[say("Sumber kata","Word resources"),result.resource_version],[say("Jumlah anotasi PDF","PDF annotations"),summary?.annotation_count ?? 0]].map(([label,value])=><div className="detail-row" key={String(label)}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></details>
        </section>}
        <footer className="workspace-footer"><Info/><p>{say("Alat bantu peninjauan. Temuan otomatis masih perlu diperiksa penulis.", "A review aid. The author should check all automated findings.")}</p></footer>
      </main>
    </div>
    <dialog ref={guide} aria-labelledby="guideTitle" onCancel={event=>{event.preventDefault();closeGuide();}}><div className="dialog-heading"><h2 id="guideTitle">{say("Cara membaca hasil", "Understanding findings")}</h2><button className="icon-button" onClick={closeGuide} aria-label={say("Tutup panduan", "Close guide")}><X/></button></div><p>{say("Mulai dari highlight, lalu cocokkan dengan konteks kalimat di PDF.", "Start with the highlight, then check the sentence in your PDF.")}</p>{[["red","Aa",say("Dugaan typo","Possible spelling issue"),say("Penulisan yang mungkin salah berdasarkan sumber dan aturan. Periksa saran sebelum mengubahnya.","A possible writing issue supported by available resources and rules. Check suggestions before changing it.")],["blue","a",say("Belum italic","Missing italics"),say("Bagian asing yang perlu italic, tetapi font terbaca normal. Nama diri memiliki pengecualian.","A foreign term needs italics, but its font is normal. Proper names have exceptions.")],["neutral","?",say("Perlu ditinjau","Needs review"),say("Bukti bahasa atau format belum cukup. Kata tidak dikenal bukan otomatis salah.","The language or formatting evidence is insufficient. An unknown word is not automatically wrong.")]].map(([color,symbol,title,description])=><div className="guide-row" key={color}><span className={`summary-symbol ${color}`}>{symbol}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}<div className="guide-note">{say("Versi eksperimen dengan cakupan kosakata terbatas. Tidak ada highlight bukan jaminan teks sudah benar. PDF scan belum didukung.", "This experimental release has limited vocabulary coverage. No highlights does not guarantee correct text. Scanned PDFs are not supported.")}</div><button className="button primary" onClick={closeGuide}>{say("Mengerti", "Understood")}</button></dialog>
  </>;
}
