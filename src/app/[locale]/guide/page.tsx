import type { Metadata } from "next";
import SiteHeader from "@/components/review/SiteHeader";
import { buildSiteMetadata } from "@/lib/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  return buildSiteMetadata((await params).locale, "/guide");
}
export default async function Guide({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const en = locale === "en";
  const say = (id: string, english: string) => en ? english : id;
  return <><SiteHeader locale={locale} section="/guide"/>
    <main className="guide-page">
      <h1>{say("Membaca hasil pemeriksaan", "Understanding your results")}</h1>
      <div className="guide-colors">
        {[["red", "Aa", say("Ejaan", "Spelling"), say("Merah menandai dugaan salah tulis. Pilih temuan untuk membaca alasannya, lalu cocokkan dengan kalimat pada PDF.", "Red marks possible spelling issues. Select a finding for its reason, then check the sentence in your PDF.")], ["blue", "a", say("Belum miring", "Missing italics"), say("Biru menandai istilah yang diduga perlu huruf miring. Periksa pemakaiannya sebelum mengubah format.", "Blue marks terms that may need italics. Check their use before changing formatting.")], ["neutral", "?", say("Perlu ditinjau", "Needs review"), say("Buktinya belum cukup. Kata tidak dikenal belum tentu salah; bagian ini tidak diberi highlight merah atau biru.", "Evidence is insufficient. An unfamiliar word is not necessarily wrong; these parts are not highlighted red or blue.")]].map(([color, symbol, title, description]) => <section key={color}><span className={`summary-symbol ${color}`} aria-hidden="true">{symbol}</span><div><h2>{title}</h2><p>{description}</p></div></section>)}
      </div>
      <section className="guide-questions"><h2>{say("Sebelum memulai", "Before you begin")}</h2>
        {[[say("PDF apa yang bisa diperiksa?", "Which PDFs can I review?"), say("PDF dengan teks yang bisa dipilih, maksimal 50 MiB. PDF hasil scan belum didukung OCR.", "PDFs with selectable text, up to 50 MiB. Scanned PDFs are not supported by OCR.")], [say("Apakah dokumen asli berubah?", "Does my original document change?"), say("Tidak. Hasil disimpan sebagai salinan PDF berpenanda. Perbaikan tetap dilakukan pada dokumen sumber Anda.", "No. Results are saved as a separate annotated PDF. Make revisions in your source document.")], [say("Apakah semua kesalahan akan ditemukan?", "Will every issue be found?"), say("Belum. Kosakata, konteks bahasa, dan ekstraksi PDF masih terbatas. Tidak adanya temuan bukan jaminan seluruh tulisan sudah benar.", "No. Vocabulary, language context and PDF extraction have limited coverage. No findings does not guarantee correct writing.")], [say("Di mana file disimpan?", "Where are files stored?"), say("File dikirim ke server pemeriksa. Hasil tersimpan tanpa penghapusan otomatis atau akun pengguna yang membatasi akses.", "Files are sent to the review server. Results remain there without automatic deletion or per-user account access controls.")], [say("Mengapa sesi lama tidak tersedia?", "Why is my previous session unavailable?"), say("Status pemeriksaan hilang saat server dimulai ulang. Unggah kembali PDF untuk memulai pemeriksaan baru.", "Review status is lost when the server restarts. Upload your PDF again to start a new review.")]].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
      </section>
      <a className="button primary" href={`/${locale}/upload`}>{say("Mulai pemeriksaan", "Start a review")}</a>
    </main>
  </>;
}
