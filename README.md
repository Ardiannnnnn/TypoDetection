# TypoTrace — ruang tinjau laporan

Frontend Next.js untuk mengunggah PDF, mengikuti pemeriksaan, dan meninjau
kandidat salah tulis serta bagian asing yang belum italic. Pemeriksaan bahasa
berjalan pada backend [Periksa Laporan](https://github.com/Papazy/periksaLaporan),
bukan pada Vercel atau browser.

Temuan adalah bantuan bagi penulis. Kata yang belum dikenal masuk tinjauan;
itu bukan bukti bahwa kata tersebut salah. Aplikasi belum menjadi grammar
checker umum, kamus lengkap, atau penilaian bahasa yang pasti. PDF hasil dan
laporan disimpan oleh backend sesuai konfigurasi penyimpanannya.

## Status salinan ini

Source asal: [Ardiannnnnn/TypoDetection](https://github.com/Ardiannnnnn/TypoDetection),
frontend situs `typo-detection.vercel.app`, dibuat oleh
[Ardian](https://github.com/Ardiannnnnn). Akun `Papazy` mempunyai akses baca,
tetapi tidak mempunyai akses push/admin pada repo asal. Clone lokal dapat ditempatkan di folder `TypoDetection` di samping repo backend.

Perubahan disiapkan lokal untuk frontend yang terhubung ke backend v3.
**Perubahan disiapkan pada clone ini untuk di-merge pengguna ke repo Ardian;
belum dideploy ke Vercel.**
Jangan menganggap perubahan lokal sudah memperbarui situs asal. Riwayat Git
asal dipertahankan; dokumentasi ini tidak menambahkan klaim lisensi yang belum
tersedia pada berkas source.

## Pembagian deployment

| Bagian | Tempat | Sumber |
| --- | --- | --- |
| Frontend ini | Vercel | Repo Ardian setelah pengguna merge |
| Backend pemeriksa | Application Dokploy baru | `Papazy/periksaLaporan`, branch `main` |
| PDF/JSON/HTML hasil | Volume `/data` pada backend | Dibuat setelah pemrosesan selesai |

Backend memakai satu worker dan satu replica. Status job masih berada di
memori proses; restart/redeploy menghilangkan status job walaupun berkas pada
volume dapat tetap tersedia. Pengguna perlu mengunggah ulang setelah sesi
pemeriksaan tidak ditemukan.

## Menjalankan lokal

Jika backend berada di folder saudara `../periksaLaporan`, setelah dependency
kedua repo terpasang jalankan `../periksaLaporan/scripts/dev-local.sh`.
Launcher menyalakan backend8002 dan frontend3000 dengan base API lokal,
tanpa perlu menyalin template domain deployment ke .env.local.
Lihat [panduan lokal backend](../periksaLaporan/docs/LOCAL.md).

Gunakan Node.js 22 dan npm. Lockfile yang dipakai untuk verifikasi adalah
`package-lock.json`.

```sh
npm ci
npm run dev
```

Backend development harus berjalan di `http://127.0.0.1:8002`. Pada mode
`development`, adapter memakai alamat itu jika konfigurasi belum diisi.
Buka `http://localhost:3000/id` atau `http://localhost:3000/en`.
Route `/id/upload` dan `/en/upload` tetap tersedia.

Untuk memakai backend lain, buat `.env.local` dari template ini lalu isi
alamat backend yang sesungguhnya:

```sh
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_API_BASE_URL=https://api-typotrace.jry.codes
```

`api-typotrace.jry.codes` adalah target backend yang dipilih; Dokploy dan DNS
akan diurus pengguna, belum deployment yang sudah tersedia. Jangan
menggunakan alamat backend lama secara diam-diam. Nilai `NEXT_PUBLIC_` masuk
bundle browser sehingga hanya boleh berisi konfigurasi publik, bukan API key
atau kredensial.

## Alur pemeriksaan

1. Pilih atau seret satu PDF dengan lapisan teks, maksimal 50 MiB.
2. Mulai pemeriksaan atau gunakan dokumen contoh sintetis dari backend.
3. Ikuti status `queued` → `processing` → `completed` atau `error`.
4. Tinjau ringkasan, temuan ejaan, kekurangan italic, dan bagian yang belum jelas.
5. Cari/filter temuan, buka halaman PDF, lalu unduh salinan hasil dan laporan.
6. Perbaiki dokumen sumber sendiri. PDF input tidak ditimpa.

Hitungan temuan logis dapat berbeda dari jumlah token atau objek highlight
PDF. Hasil tanpa highlight tidak menjamin seluruh naskah sudah benar. PDF scan
belum didukung OCR oleh backend.

## Deployment dan pengujian

- [Panduan merge dan Vercel](docs/VERCEL.md)
- [Panduan tes integrasi dan contoh yang diharapkan](docs/TESTING.md)
- [Panduan backend Dokploy](https://github.com/Papazy/periksaLaporan/blob/main/docs/DEPLOY-DOKPLOY.md)

Untuk memeriksa build production lokal setelah konfigurasi API diisi:

```sh
npm run build
npm start
```

Keberhasilan build hanya membuktikan frontend dapat dibangun. Alur upload,
CORS, versi engine, dan artefak harus diuji dengan backend nyata. Catat hasil
pengujian yang benar-benar dijalankan; jangan memakai skor bahasa sebagai
klaim akurasi seluruh dokumen.
