import Link from 'next/link';

interface NavbarProps {
  showBackButton?: boolean;
}

export default function Navbar({ showBackButton = false }: NavbarProps) {
  return (
    <nav className="container mx-auto px-6 py-6 font-poppins">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg font-poppins">T</span>
          </div>
          <span className="text-2xl font-bold text-gray-800 font-poppins">TypoDetector</span>
        </Link>
        
        {showBackButton ? (
          <Link 
            href="/"
            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 font-poppins"
          >
            ← Back to Home
          </Link>
        ) : (
          <Link 
            href="/upload"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-poppins"
          >
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}
