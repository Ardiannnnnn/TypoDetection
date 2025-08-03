import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-poppins">
      <Navbar showBackButton={true} />
      
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="text-9xl font-bold text-indigo-600 mb-4 font-poppins">404</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-poppins">Page Not Found</h1>
            <p className="text-xl text-gray-600 mb-8 font-poppins">
              The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 font-poppins"
            >
              Go Home
            </Link>
            <Link 
              href="/upload"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors duration-200 font-poppins"
            >
              Upload Document
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
