import localFont from 'next/font/local'

export const poppins = localFont({
  src: '../../public/fonts/Poppins-Regular.ttf',
  variable: '--font-poppins',
  display: 'swap',
  weight: '100 900', // Support all weights with fallback
})