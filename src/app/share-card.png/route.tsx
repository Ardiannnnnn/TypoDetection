import { ImageResponse } from "next/og";

const size = { width: 1200, height: 630 };
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: "74px 80px", background: "#f5f6fa", color: "#1d2638", fontFamily: "sans-serif" }}>
    <div style={{ display: "flex", fontSize: 30, color: "#0066cc" }}>TypoTrace</div>
    <div style={{ display: "flex", fontSize: 64, fontWeight: 600, letterSpacing: -2, lineHeight: 1.15, maxWidth: 860, marginTop: 66 }}>Periksa ejaan dan italic pada PDF laporan.</div>
    <div style={{ display: "flex", fontSize: 25, color: "#647084", marginTop: 26 }}>Tinjau temuan per halaman. Unduh salinan berhighlight.</div>
    <div style={{ display: "flex", fontSize: 20, color: "#647084", marginTop: "auto", borderTop: "1px solid #d5dce7", paddingTop: 22 }}>typotrace.jry.codes</div>
  </div>, size);
}
