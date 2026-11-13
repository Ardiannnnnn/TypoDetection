# Hasil verifikasi lokal — 12 November 2026

Perubahan frontend diuji secara lokal sebelum diajukan melalui PR;
belum dideploy. Upstream Ardiannnnnn/TypoDetection hanya
memberi akun aktif akses pull, tanpa push/admin (GitHub API diperiksa).

## Pemeriksaan yang lulus

- `npm run test:api`: 12 tes lulus.
- `npm run typecheck`: lulus.
- `npm run build`: lulus tanpa API dan dengan
  `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8002`.
- Backend: 14 tes CORS lulus, satu warning deprecation TestClient/httpx.
- Browser production localhost3000: tanpa konfigurasi, pesan layanan belum
  terhubung terlihat dan tombol pilih PDF disabled.
- Dengan backend v3 lokal: contoh diunggah langsung, completed100,
  policy usk-2024-v3/resources evaluation-v3.0. Dua halaman,78 token sumber,
  2 temuan ejaan,2 italic,18 tinjau. Counter token berbeda dari jumlah temuan.
- Filter, pencarian, pemilihan temuan, refresh memulihkan hasil, /en/upload,
  penolakan txt serta dialog/Escape diperiksa di browser.
- PDF hasil HTTP200/7508byte; HTML HTTP200/318677byte; preview HTTP200.
- Mobile390x844 tanpa overflow horizontal; console browser0error/0warning.
- `git diff --check`: lulus.

Node mengeluarkan warning module type dan experimental MockTimers saat tes.
Tidak ada perubahan engine bahasa; hasil ini bukan ukuran akurasi bahasa baru.
Belum menguji deployment publik, pemulihan jaringan putus, PDF besar,
pagination banyak halaman atau seluruh kasus di TESTING.md.

Bukti lokal sementara: `/tmp/periksa-frontend-check.SsJ3wR`, termasuk screenshot
desktop/mobile, snapshot browser, dan artefak backend sintetis. Server tes
sudah dihentikan. Tidak memakai dokumen pengguna atau membaca file rahasia.

## Kelanjutan deployment

Arahan setelah verifikasi: pengguna mengurus Dokploy dan merge frontend ke
repo Ardian sendiri. Repo privat baru tidak diperlukan. Target backend dipilih
`https://api-typotrace.jry.codes`; .env.example dan panduan sudah disesuaikan.
DNS/HTTPS/deploy publik belum dilakukan. Isi base API sebelum build dan origin
frontend pada CORS backend. Repo asal tetap read-only bagi akun agen.

## Persiapan PR — 13 November 2026

Tes adapter dijalankan kembali:12/12 lulus; pemeriksaan TypeScript dan
`git diff --check` lulus. Build production serta bukti browser di atas tetap
berlaku untuk kode aplikasi yang sama; perubahan setelahnya hanya dokumentasi.
Frontend dan backend lokal dipulihkan setelah Orca restart; smoke HTTP backend
13November kembali lulus. Deployment publik belum diuji.
