# Desain dan SEO

## Halaman

| Route (locale id/en) | Isi |
| --- | --- |
| /{locale} | Beranda, motion dokumen, screenshot hasil nyata, cara kerja |
| /{locale}/upload | Unggah, progress, temuan, preview PDF dan unduh |
| /{locale}/guide | Arti penanda, batas pemeriksaan, penyimpanan dan FAQ |

Tema terang memakai putih hangat dengan aksen cobalt/coral/mint; tema gelap
memakai navy. Pilihan tema tersimpan di browser, awalnya mengikuti sistem.
Workspace tidak memakai sidebar/footer disclaimer berulang. Ringkasan dapat
diklik sebagai filter, dan alasan ditampilkan saat temuan dipilih. Desktop
menempatkan PDF kiri/temuan kanan; mobile mendahulukan daftar temuan.
Bantuan/versi tersedia di dialog. Teks PDF ditampilkan sebagai teks React.

Hero memuat motion dokumen manual sesuai referensi pemilik:3lembar,
kaca pembesar dan penanda ejaan/italic,5detik per lembar. Tombol jeda/putar
tersedia dan prefers-reduced-motion menampilkan ilustrasi statis. Aset produk
berupa screenshot contoh sintetis; lihat [ASSETS.md](ASSETS.md).

## Domain tujuan

- Frontend: https://typotrace.jry.codes
- Backend: https://api-typotrace.jry.codes

Ini target konfigurasi, belum klaim DNS atau deployment aktif. Frontend
Vercel perlu NEXT_PUBLIC_API_BASE_URL saat build dan CORS backend sesuai
origin frontend. Tambahkan domain di Settings → Domains dan pasang record
DNS sesuai nilai yang diberikan Vercel, lalu verifikasi HTTPS. Deployment
backend dikelola terpisah oleh pemilik. Detail di [VERCEL.md](VERCEL.md).

## SEO

- Judul/deskripsi Indonesia–Inggris, HTML lang, canonical/hreflang, Open Graph
  dan Twitter Card di src/lib/site.ts.
- Beranda, upload dan guide mempunyai canonical sendiri. Sitemap memuat6URL
  (2bahasa×3halaman), tanpa URL job atau tanggal lastmod buatan.
- Robots/meta mengizinkan indeks production; development dan Vercel Preview
  memakai disallow/noindex. Robots bukan kontrol akses dokumen.
- /share-card.png menghasilkan gambar1200×630 tanpa layanan gambar/font luar.
- Setelah deployment: verifikasi domain di Search Console dan submit sitemap.
  Source ini tidak menjamin peringkat pencarian.

## Verifikasi

Build production source aplikasi yang sama lulus. Browser desktop1440 dan
mobile390 diperiksa visual,320/390 tanpa overflow. Tema terang/gelap, jeda/
putar, pergantian halaman ilustrasi serta upload contoh→hasil v3 diperiksa.
Metadata6route dan sitemap6URL terverifikasi lewat HTTP production lokal.
Tidak ada deployment publik atau perubahan DNS melalui pekerjaan ini.

Reduced-motion tersedia dalam CSS; perubahan setting OS belum diuji.
Tes teknis tidak membuktikan akurasi bahasa. Detail batas pengujian ada pada
[hasil verifikasi](HASIL-VERIFIKASI-2026-11-12.md).
