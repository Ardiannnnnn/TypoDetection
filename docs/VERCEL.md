# Merge frontend dan deployment Vercel

Target: frontend ini di Vercel, backend v3 di Application Dokploy baru.
Backend sudah disiapkan pada `Papazy/periksaLaporan`, branch `main`.
Target backend: **`https://api-typotrace.jry.codes`**, belum dideploy.
Pengguna mengurus Dokploy/DNS; agen menyiapkan source dan Docker backend.

## 1. Merge clone frontend ke repo Ardian

Clone lokal berasal dari `Ardiannnnnn/TypoDetection`, dengan riwayat dan atribusi
asal dipertahankan. Sesuai arahan pengguna, perubahan disiapkan di clone ini;
pengguna akan merge ke repo Ardian. Repo privat baru tidak diperlukan.
Akun agen hanya punya akses baca dan push upstream dinonaktifkan.

Review diff dan berkas baru, lalu commit perubahan frontend. Pengguna dapat
memindahkan commit lewat branch/fork atau patch dan merge ke repo asal memakai
akun yang berwenang. Jangan memasukkan .env.local, node_modules, .next atau
hasil pengujian. Tidak perlu menghapus situs Vercel lama.

## 2. Deploy backend dahulu

Pada Dokploy, pilih repository `Papazy/periksaLaporan`, branch `main`, build
Dockerfile dengan context `.`, port container `8002`, satu replica, dan volume
`/data`. Ikuti [panduan backend](https://github.com/Papazy/periksaLaporan/blob/main/docs/DEPLOY-DOKPLOY.md).

Setelah deployment mempunyai domain HTTPS, verifikasi:

- `/` mengembalikan informasi layanan dengan status running.
- `/ui/` dapat mengunggah dokumen contoh sampai selesai/100.
- Hasil memakai policy `usk-2024-v3` dan sumber `evaluation-v3.0`.
- PDF, laporan HTML, dan daftar temuan tersedia.

Alamat lama yang tertanam pada source sebelum perubahan adalah
`https://periksa-laporan.jrycodes.me`. Alamat tersebut bukan default backend
baru dan tidak dipakai sebagai fallback production.

## 3. Deploy frontend di Vercel setelah merge

Gunakan project Vercel yang terhubung ke repo Ardian setelah perubahan
digabungkan oleh pengguna. Isi konfigurasi:

| Pengaturan | Nilai |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | Root repository ini |
| Production Branch | `main` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Node.js | 22.x |
| Environment Variable | `NEXT_PUBLIC_API_BASE_URL` |
| Nilai variable | `https://api-typotrace.jry.codes` |

Domain di atas adalah target yang disepakati, belum alamat aktif. Nilai harus berupa base origin HTTP(S),
tanpa `/upload`, `/ui`, kredensial, atau API key. Gunakan HTTPS untuk frontend
production yang dilayani HTTPS agar browser tidak memblokir mixed content.

`NEXT_PUBLIC_API_BASE_URL` dibaca saat build, sesuai
[dokumentasi environment Next.js](https://nextjs.org/docs/app/guides/environment-variables).
Set variable untuk environment Vercel yang digunakan, lalu **redeploy** setelah
nilainya berubah. Mengubah variable tanpa membangun ulang tidak mengubah bundle
browser yang sudah dipublikasikan. Production tanpa konfigurasi tidak boleh
mengirim dokumen ke backend lama atau otomatis ke localhost pengguna.

## 4. Sesuaikan CORS backend

Frontend dan backend merupakan origin berbeda. Backend saat ini mengizinkan:

- `https://typo-detection.vercel.app`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

Jika project Vercel baru mendapat domain berbeda, isi environment backend pada
Dokploy, lalu restart/redeploy backend:

```dotenv
CORS_ORIGINS=https://DOMAIN_FRONTEND_ANDA
```

`CORS_ORIGINS` adalah daftar origin dipisah koma dan mengganti daftar default.
Jika ingin mengizinkan beberapa origin, sebutkan semuanya, misalnya domain
production serta origin development yang diperlukan. Slash penutup dinormalisasi;
gunakan origin HTTP(S) tanpa path, query atau kredensial. Ini konfigurasi publik,
bukan secret. Perubahan dibaca saat proses backend dimulai.

Domain preview
Vercel juga berbeda dari production; jangan menganggap semua preview otomatis
terdaftar. Origin tidak menyertakan path seperti `/id` atau `/en`.

Sebelum mencoba unggahan, pastikan request dari domain frontend tersebut
mendapat header CORS yang sesuai. Pesan jaringan dari browser bisa berarti
CORS, DNS, sertifikat, atau backend belum tersedia, bukan selalu kesalahan PDF.

## 5. Upload langsung ke backend

Browser mengirim `multipart/form-data` dengan field `file` langsung ke
backend Dokploy. Jangan memindahkan unggahan ini ke Next.js API route atau
Vercel Function hanya untuk menyembunyikan alamat backend. Backend menerima
PDF hingga 50 MiB, sedangkan payload Vercel Function dibatasi 4,5 MB menurut
[dokumentasi Vercel](https://vercel.com/docs/functions/limitations).

Progress, findings, preview, download dan report juga menunjuk origin backend.
Path relatif seperti `/download/JOB_ID` yang dikembalikan API harus diselesaikan
terhadap base backend, bukan terhadap hostname Vercel. Jangan memasukkan isi
PDF atau nama file sebagai HTML mentah.

## 6. Verifikasi setelah deploy

Gunakan [langkah testing](TESTING.md) dari domain production yang sesungguhnya.
Periksa kedua bahasa `/id` dan `/en`, tampilan mobile, upload, polling, filter,
pagination, preview dan unduh. Pastikan tidak ada request ke backend lama.

Belum ada login/otorisasi pada kontrak backend saat ini; `/static` memberi akses
langsung ke artefak sesuai nama path. Penyimpanan volume tidak berarti dokumen
langsung dihapus setelah diproses. Gunakan deployment dan dokumen uji yang
sesuai, serta kontrol akses infrastruktur bila dipakai untuk dokumen pribadi.
