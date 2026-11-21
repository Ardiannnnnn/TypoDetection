# Pratinjau PDF tanpa unduhan ulang per halaman

21 November 2026. Screenshot pemilik menunjukkan viewer PDF terus memuat saat
berpindah halaman. Komponen lama memakai key job-id+halaman pada iframe dengan
URL server; setiap pergantian halaman membuang plugin PDF dan memuat ulangnya.
Respons dokumen tetap no-store demi privasi. PDF contoh kasus production 92
halaman berukuran 4.729.629 byte; server mengembalikan 200 serta 206 untuk Range.

## Perubahan dan alasan

ReviewWorkspace mengunduh preview sekali saat hasil job tersedia. fetchPreview
memakai XHR GET dengan responseType blob, cookie sesi dan progress unduhan nyata.
Blob diberi object URL lokal untuk viewer. Pergantian halaman tetap membuat
viewer pada hash halaman yang dipilih, tetapi sumbernya blob yang sama; tidak
mengunduh file server berulang. Tombol Buka PDF/Unduh tetap menuju endpoint
server terotorisasi. Menghilangkan key halaman saja sudah dicoba: iframe tetap
hidup, tetapi Chrome PDF tidak mengikuti hash ke halaman berikutnya. Pendekatan
tersebut tidak dirilis.

Saat unduhan awal berlangsung tampil Memuat PDF beserta byte/total MB jika
diketahui. Total tidak diketahui memakai progress tanpa persentase. Gagal
unduh menampilkan coba lagi; HTTP401 tetap ditolak. Tidak membuka static,
menyisipkan token di URL, atau menaruh kunci admin dalam browser.

Effect hanya bergantung pada job hasil dan tombol retry. Response yang selesai
setelah abort tidak membuat object URL. Object URL dicabut saat job berubah,
reset atau komponen dilepas; request yang masih berjalan dibatalkan. Blob tidak
disimpan di localStorage atau cache bersama. Ini satu salinan aktif per tab;
PDF sangat besar tetap menggunakan sumber daya browser. Pemuatan awal dan
render native PDF tetap memerlukan waktu; ini bukan optimasi engine backend.

## Bukti

19 tes service lulus. Kasus baru memeriksa GET dengan cookie, responseType blob,
event byte aktual, status401 dan respons200 bukan PDF. Kasus upload/cancel/
timeout lama tetap lolos. Build produksi diperiksa sebelum deploy.

Uji lokal pada PDF sintetis160halaman: viewer benar-benar menunjukkan halaman2
beserta teks halaman2. Network capture menunjukkan0 request HTTP preview baru
setelah navigasi dari halaman1ke2dan3. Nomor pada kontrol aplikasi dan viewer
native diperiksa secara visual di desktop. Workspace ponsel390juga dilihat.
Tidak menyatakan semua browser native memiliki waktu render yang sama.
