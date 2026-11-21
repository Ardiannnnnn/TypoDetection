import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import SiteHeader from "@/components/review/SiteHeader";
import DocumentMotion from "@/components/review/DocumentMotion";
import { buildWebApplicationJsonLd, serializeJsonLd } from "@/lib/site";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const en = locale === "en";
  const say = (id: string, english: string) => en ? english : id;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildWebApplicationJsonLd(locale)) }} />
    <SiteHeader locale={locale} />
    <main className="landing">
      <section className="landing-hero">
        <div className="hero-copy">
          <h1>{say("Laporan ", "Report ")}<span>{say("selesai", "finished")}</span>.<br />{say("Saatnya ", "Time for a ")}<span>{say("diperiksa.", "review.")}</span></h1>
          <p>{say("Bantu temukan ejaan yang terlewat dan istilah yang belum miring. Tinjau langsung di PDF laporan Anda.", "Find possible spelling issues and terms that need italics. Review them directly in your Indonesian PDF report.")}</p>
          <div className="hero-actions"><a className="button primary hero-action" href={`/${locale}/upload`}>{say("Periksa laporan saya", "Review my report")}<ArrowRight aria-hidden="true" /></a><a className="hero-example-link" href="#example">{say("Lihat hasilnya", "See the results")}</a></div>
        </div>
        <DocumentMotion english={en} />
      </section>
      <section className="landing-example actual-product" id="example" aria-labelledby="exampleTitle">
        <div className="section-heading"><h2 id="exampleTitle">{say("Temuannya jelas.\nLetaknya juga.", "See the findings.\nRight on the page.")}</h2><p>{say("Pilih sebuah temuan, baca alasannya, lalu lihat bagian yang ditandai pada PDF.", "Select a finding, read its reason, and see the highlighted passage in your PDF.")}</p>
        </div>
        <a className="product-capture" href="/images/review-example.png" target="_blank" rel="noopener" aria-label={say("Perbesar screenshot hasil pada PDF contoh", "Enlarge the screenshot of the sample PDF results")}><Image src="/images/review-example.png" alt={say("Screenshot asli TypoTrace: PDF contoh dengan highlight merah dan biru, daftar temuan di sebelah kanan", "Actual TypoTrace screenshot: a sample PDF with red and blue highlights and findings on the right")} width={1440} height={1100} sizes="(max-width: 850px) 100vw, 1200px" /></a>
        <div className="product-benefits">{[say("Temuan per halaman", "Findings by page"), say("PDF asli tetap utuh", "Your original stays intact"), say("Hasil bisa diunduh", "Download your results")].map(label => <span key={label}><Check aria-hidden="true" />{label}</span>)}</div>
      </section>
      <section className="landing-how" aria-labelledby="howTitle"><h2 id="howTitle">{say("Dari PDF ke revisi, dalam tiga langkah.", "From PDF to revision in three steps.")}</h2>
        <ol>{[[say("Unggah laporan", "Upload your report"), say("Pilih PDF dengan teks yang dapat diseleksi.", "Choose a PDF with selectable text.")], [say("Tinjau penandaan", "Review the highlights"), say("Periksa kandidat salah ejaan dan istilah yang perlu italic dalam konteksnya.", "Review possible spelling issues and terms that need italics in context.")], [say("Revisi dokumen asli", "Revise your source document"), say("Unduh PDF beranotasi sebagai panduan perbaikan.", "Download the annotated PDF to guide your revisions.")]].map(([title, description]) => <li key={title}><h3>{title}</h3><p>{description}</p></li>)}</ol>
      </section>
      <section className="landing-end"><h2>{say("Tinjau sekali lagi\nsebelum dikirim.", "One final review\nbefore you send it.")}</h2><a className="button primary" href={`/${locale}/upload`}>{say("Pilih PDF", "Choose a PDF")}<ArrowRight aria-hidden="true" /></a><a className="text-button" href={`/${locale}/guide`}>{say("Panduan penandaan", "Understanding highlights")}</a></section>
    </main>
  </>;
}
