# TypoDetector - AI-Powered Typo Detection System

TypoDetector adalah aplikasi web modern yang menggunakan teknologi AI untuk mendeteksi kesalahan ejaan (typo) dan grammar dalam dokumen teks. Aplikasi ini dibangun menggunakan [Next.js](https://nextjs.org) dengan TypeScript dan Tailwind CSS.

## Fitur Utama

- 🤖 **AI-Powered Detection**: Menggunakan algoritma machine learning untuk deteksi typo yang akurat
- ⚡ **Lightning Fast**: Proses dokumen dalam hitungan detik
- 🔒 **Secure & Private**: Dokumen diproses secara aman dan tidak disimpan di server
- 📱 **Responsive Design**: Interface yang responsif untuk semua perangkat
- 🎨 **Modern UI**: Menggunakan font Poppins dan desain yang clean

## Teknologi yang Digunakan

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Font**: Poppins (offline)
- **Icons**: Heroicons (SVG)

## Struktur Aplikasi

- **Landing Page** (`/`): Halaman utama dengan informasi tentang aplikasi
- **Upload Page** (`/upload`): Halaman untuk upload dan analisis dokumen
- **About Page** (`/about`): Informasi detail tentang teknologi dan cara kerja
- **404 Page**: Halaman error yang user-friendly

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, atau bun

### Installation

1. Clone repository ini:
```bash
git clone https://github.com/Ardiannnnnn/TypoDetection.git
cd typodeteksi
```

2. Install dependencies:
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

3. Download font Poppins (opsional, sudah ada fallback):
```bash
# Jalankan script otomatis
powershell -ExecutionPolicy Bypass -File download-fonts.ps1

# Atau download manual dari https://fonts.google.com/specimen/Poppins
# Letakkan file font di folder public/fonts/
```

4. Jalankan development server:

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
# atau
bun dev
```

5. Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat aplikasi.

## Cara Menggunakan

1. **Landing Page**: Buka aplikasi dan lihat informasi tentang TypoDetector
2. **Upload Document**: Klik "Get Started" atau "Upload Document"
3. **Drag & Drop**: Seret file .txt ke area upload atau klik untuk browse
4. **Detect Typos**: Klik tombol "Detect Typos" untuk memulai analisis
5. **View Results**: Lihat hasil deteksi dengan statistik dan saran perbaikan

## File Structure

```
typodeteksi/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── upload/page.tsx    # Upload page
│   │   ├── about/page.tsx     # About page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   └── fonts.css          # Font definitions
│   └── components/            # Reusable components
│       ├── Navbar.tsx
│       └── LoadingSpinner.tsx
├── public/
│   ├── fonts/                 # Local fonts
│   └── *.svg                  # Icons and images
├── FONT_INSTRUCTIONS.md       # Font setup guide
└── download-fonts.ps1         # Font download script
```

## Development

### Menambahkan Fitur Baru

1. **Komponen Baru**: Buat di folder `src/components/`
2. **Halaman Baru**: Buat di folder `src/app/`
3. **Styling**: Gunakan Tailwind CSS classes
4. **Font**: Semua komponen sudah menggunakan font Poppins

### Kustomisasi

- **Warna**: Edit variabel warna di `tailwind.config.ts`
- **Font**: Ganti font di `src/app/fonts.css`
- **Layout**: Modifikasi `src/app/layout.tsx`

This project uses Poppins font for better readability and modern design. The font is loaded locally for optimal performance.

## Learn More

Untuk mempelajari lebih lanjut tentang teknologi yang digunakan:

- [Next.js Documentation](https://nextjs.org/docs) - pelajari fitur dan API Next.js
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/docs) - JavaScript with type safety
- [React](https://react.dev) - library untuk membangun user interface

## Contributing

1. Fork repository ini
2. Buat branch untuk fitur baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Deploy on Vercel

Cara termudah untuk deploy aplikasi TypoDetector:

1. Push code ke GitHub repository
2. Import project di [Vercel Platform](https://vercel.com/new)
3. Configure build settings (otomatis untuk Next.js)
4. Deploy!

Aplikasi akan tersedia di URL yang diberikan Vercel.

## Screenshots

### Landing Page
![Landing Page](docs/landing-page.png)

### Upload Page
![Upload Page](docs/upload-page.png)

### Results Page
![Results](docs/results-page.png)

## Author

**Ardian** - [@Ardiannnnnn](https://github.com/Ardiannnnnn)

## Acknowledgments

- Font Poppins dari Google Fonts
- Icons dari Heroicons
- Tailwind CSS untuk styling
- Next.js team untuk framework yang luar biasa
