# Frontend selama akses dokumen ditutup

21 November 2026. Frontend tetap publik untuk informasi/contoh; pemrosesan
dan hasil pengguna dilindungi backend. Pembayaran belum tersedia.

## Logika utama

`src/service/uploadService.ts` membaca `/api/access` dengan cache no-store,
tanpa cookie/kunci admin. `canUpload` hanya mengizinkan mode free dengan
`public_upload_enabled === true`. Backend saat ini selalu memberi false.
Field hilang, string "true", konfigurasi kosong, dan koneksi gagal tidak
membuka upload. Pemeriksaan UI bukan otorisasi; backend tetap menolak
permintaan langsung tanpa izin.

`ReviewWorkspace.tsx` menunggu status tersebut sebelum menawarkan pemilih
file, drag/drop, upload, contoh yang memproses PDF, dan pemulihan job lama.
Saat tertutup, tampil status singkat serta tautan contoh hasil pada landing.
Tidak ada form kunci admin. Preview/hasil tidak memakai query token.

`next.config.ts` menolak environment frontend yang mengandung kunci pemilik
atau nama NEXT_PUBLIC_* yang menunjukkan kredensial. Nama/presensi diperiksa
tanpa mencetak nilainya. Tidak mendeteksi rahasia yang disisipkan dengan nama
lain. Header nosniff, no-referrer, anti-framing, Permissions-Policy dan CSP
dasar berlaku pada halaman. CSP belum nonce-based untuk semua script inline.

## Konfigurasi produksi

```env
NEXT_PUBLIC_API_BASE_URL=https://checkyourpaper-api.jry.codes
```

ADMIN_ACCESS_TOKEN hanya boleh berada pada backend Dokploy. Jika sebelumnya
pernah masuk NEXT_PUBLIC_*, hapus dari hosting frontend, rebuild, dan rotasi
kunci backend; menghapus env tidak menarik kembali bundle lama.

Perubahan env publik memerlukan build/deploy baru di Vercel. Backend harus
sudah menjalankan gerbang privat, serta mengizinkan origin frontend pada CORS.
Domain frontend dan backend yang berbeda belum menyediakan sesi pembeli.
Jangan membuka API hanya agar tombol frontend berfungsi.

## Verifikasi

`npm run test:api`, `npm run typecheck`, `npm run build`. Uji availability
meliputi respons privat/legacy, flag salah tipe, mode paid, dan respons rusak.
Build dengan kredensial sentinel ditolak tanpa mencetak sentinel. Pemeriksaan
HTTP produksi harus membuktikan upload/hasil tanpa izin mendapat 401; UI
disabled saja tidak membuktikan hal itu. Lihat dokumen bukti deployment
backend untuk hasil pengujian yang benar-benar dilakukan.
