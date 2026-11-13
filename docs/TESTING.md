# Testing frontend dan backend v3

Dokumen ini adalah langkah verifikasi. Hasil tes aktual dicatat terpisah setelah
perintah atau skenario benar-benar dijalankan. Build frontend bukan bukti
ketepatan bahasa, dan source yang baru di-clone belum otomatis dideploy.

## Prasyarat

- Frontend lokal `http://localhost:3000` atau domain Vercel yang akan diuji.
- Backend v3 aktif dan `NEXT_PUBLIC_API_BASE_URL` sesuai domain backend.
- CORS backend mengizinkan origin frontend persis.
- Gunakan PDF asli sebelum highlight aplikasi, dengan teks yang dapat disalin.
- Untuk contoh sintetis, gunakan tombol dokumen contoh dari backend.

## 1. Build dan rute

```sh
npm ci
npm run build
npm start
```

Buka `/id`, `/en`, `/id/upload` dan `/en/upload`. Pastikan bahasa, navigasi,
judul halaman, tombol dan fokus keyboard dapat digunakan. Uji desktop dan
mobile sekitar lebar390px; tidak ada horizontal scroll pada halaman utama.

Untuk build production, isi variable API sebelum build. Uji juga kondisi
konfigurasi API kosong: UI perlu menjelaskan layanan belum tersedia dan tidak
boleh mengirim PDF ke hostname lama atau localhost production.

## 2. Alur nyata dari browser

| Langkah | Harapan |
| --- | --- |
| Pilih satu PDF atau drag/drop | Nama dan ukuran terlihat; belum ada unggahan sebelum pengguna memulai. |
| Coba `.txt`, berkas kosong, lebih dari50MiB atau drop beberapa file | Ada pesan yang mudah dipahami; pemeriksaan tidak dimulai. |
| Mulai pemeriksaan | Request langsung ke backend, field multipart `file`, HTTP200 membawa `job_id`. |
| Polling | Status queued/processing ditampilkan; completed100 hanya sesudah hasil tersedia. |
| Selesai | Policy `usk-2024-v3`, sumber `evaluation-v3.0`, ringkasan dan temuan tersedia. |
| Filter Typo/Italic/Tinjau | Daftar dan total mengikuti jenis yang dipilih. |
| Cari kata/frasa | Pencarian dilakukan pada API sebelum pagination; query tidak melebihi160karakter. |
| Pagination | Navigasi tidak melewati halaman pertama/terakhir; default20item. |
| Pilih temuan | Preview atau tautan PDF membuka halaman sumber yang sesuai. |
| Download/report | Tautan menuju backend; PDF terbuka dan laporan HTML tersedia. |
| Dokumen baru | State/filter/query/file lama direset tanpa menampilkan hasil job lain. |
| Refresh tab | Job tersimpan dapat dilanjutkan pada origin backend yang sama. |

Perhatikan tab Network browser: tidak ada fallback ke
`periksa-laporan.jrycodes.me`, dan upload tidak melewati Vercel Function.
File uji besar di atas4,5MB tetapi di bawah50MiB membantu membuktikan jalur
langsung backend. Gunakan PDF sintetis untuk pengujian tersebut.

## 3. Contoh bahasa yang diprioritaskan

Buat PDF kecil satu kolom dari kalimat ini. Kata software pada baris terakhir
saja dibuat italic sebelum ekspor; yang lain menggunakan font normal.

```text
Sistem tersusun atas beberapa unit.
Setiap data memiliki label dan format.
Penulis bekerja di kantor.
Ia berkerja di kantor.
Data di uraikan dalam laporan.
Peneliti mengetik laporan dan melakukan pengetikan ulang.
Peneliti menggunakan software.
Peneliti menggunakan software.
```

| Sasaran | Harapan menurut cakupan kandidat v3 |
| --- | --- |
| unit, label, format | Dikenali sebagai Indonesia pada konteks ini; tidak biru. |
| bekerja | Sesuai; tidak merah. |
| berkerja | Kandidat salah tulis, merah; saran bekerja. |
| di uraikan | Kandidat salah pisah, merah; saran diuraikan. |
| mengetik, pengetikan | Dikenali; tidak merah/biru. |
| software normal | Asing perlu italic; biru. |
| software sudah italic | Format sesuai; tidak biru. |

Kata lain masih dapat masuk tinjauan karena sumber belum lengkap. Jumlah
highlight tidak sama dengan jumlah seluruh kesalahan. Kasus ini sudah menjadi
bahan development, bukan gold pakar atau holdout independen.

## 4. Kegagalan dan pemulihan

- Putuskan koneksi sementara saat polling. Pastikan UI memberi kesempatan
  memeriksa status lagi; jangan langsung mengunggah ulang dan membuat job ganda.
- Restart backend setelah menyimpan job uji. Endpoint job lama dapat404 karena
  status ada di memori; UI menjelaskan sesi tidak tersedia dan menawarkan upload
  baru. Volume hasil tidak mengembalikan dictionary job.
- Ganti base API kemudian rebuild. Job dari backend sebelumnya jangan dipulihkan
  sebagai job backend baru hanya karena sessionStorage masih ada.
- Coba PDF invalid/terkunci/scan. Pesan kegagalan tidak diklaim sebagai deteksi
  bahasa berhasil. Jangan menampilkan hasil completed jika processing error.
- Periksa filename berkarakter khusus dan teks seperti `<script>` ditampilkan
  sebagai teks biasa, bukan dieksekusi.

## 5. Catat bukti

Gunakan format ringkas:

| Tanggal / commit frontend | URL frontend dan versi backend | Skenario | Harapan | Aktual | Status |
| --- | --- | --- | --- | --- | --- |
| Belum dijalankan | Isi setelah tersedia | Upload contoh | Completed100, artefak tersedia | — | Belum diuji |

Simpan screenshot, request/status yang relevan, serta halaman PDF yang ditinjau
pada lokasi hasil lokal yang tidak dipush bila mengandung dokumen pribadi.
Jangan menyertakan `.env`, token, isi CV atau data pribadi pada laporan publik.
