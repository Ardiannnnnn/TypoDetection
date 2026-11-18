# Hasil verifikasi frontend

Diperbarui14November2026. Bukti12–13November berasal dari pengujian lokal
sebelum PR; source aplikasi final telah dibangun ulang setelah menggabungkan
main Ardian (31dd7f0). PR ini tidak melakukan merge atau deployment production.

## Bukti yang tersedia

- Tes adapter API14November:12/12lulus. Meliputi konfigurasi base API,
  FormData field file, validasi PDF/batas50MiB, kontrak progress/hasil,
  filter/pagination/query, error, timeout dan pembatalan.
- Build production setelah merge main:berhasil, termasuk validasi TypeScript.
  Build pada snapshot commit terpisah menjaga server dev tetap berjalan.
- Browser lokal:contoh→completed100 dengan policy usk-2024-v3 dan resources
  evaluation-v3.0;2halaman/78token,2temuan ejaan/2italic/18tinjau.
- Filter, pencarian, pilihan ringkasan yang membersihkan query, preview halaman,
  refresh/session restore, /en/upload, penolakan txt dan dialog/Escape diperiksa.
- PDF hasil dan HTML merespons200. Counter token dibedakan dari jumlah temuan.
- Render desktop1440 dan mobile390 dilihat,320/390 tanpa overflow horizontal.
  Tema terang/gelap, jeda/putar motion serta pergantian lembar diperiksa.
- Metadata enam route bahasa (beranda/upload/guide), canonical/hreflang/lang,
  sitemap6URL, robots serta share PNG diperiksa lewat HTTP production lokal.
- Production tanpa API menampilkan layanan belum terhubung dan menonaktifkan
  unggah; backend lama tidak menjadi fallback.
- git diff --check lulus. Scan pola token/private-key pada diff tidak menemukan
  kecocokan; tidak menyertakan .env.local atau dokumen pengguna.

## Batas verifikasi

Belum menguji deployment publik, pemulihan jaringan browser putus, PDF besar,
pagination dengan banyak halaman, atau setting OS reduced-motion secara nyata.
CSS reduced-motion disediakan. Tes teknis bukan ukuran akurasi bahasa baru.

Node mengeluarkan warning module type serta experimental MockTimers pada tes.
Pengujian CORS backend sebelumnya:14lulus/1warning TestClient-httpx; source
backend terpisah, bukan isi PR frontend. Dependency transitif tidak dikunci
lintas repo backend; gunakan versi backend yang telah diverifikasi.

Base API production harus diisi sebelum build. DNS/Dokploy/Vercel production
belum disiapkan melalui PR ini; lihat VERCEL.md.
