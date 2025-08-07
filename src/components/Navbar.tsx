'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  showBackButton?: boolean;
}

export default function Navbar({ showBackButton = false }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Change navbar appearance when scrolled
      setIsScrolled(window.scrollY > 50);

      // Track active section for highlighting (only on home page)
      if (pathname === '/') {
        const sections = ['hero', 'about', 'how-it-works', 'contact'];
        const currentSection = sections.find(section => {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            return rect.top <= 100 && rect.bottom >= 100;
          }
          return false;
        });
        
        setActiveSection(currentSection || 'hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after clicking
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    // If we're on home page, scroll to top instead of navigating
    if (pathname === '/') {
      e.preventDefault();
      scrollToTop();
    }
    // If we're on other pages, let the Link component handle navigation normally
  };

  const navLinks = [
    { id: 'about', label: 'About', href: '#about' },
    { id: 'how-it-works', label: 'How It Works', href: '#how-it-works' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-poppins ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 z-10 group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-white font-bold text-lg font-poppins">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-800 font-poppins transition-colors duration-200 group-hover:text-indigo-600">
              TypoDetector
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!showBackButton && (
            <div className="hidden lg:flex items-center space-x-8">
              {/* Home/Hero Link */}
              <button
                onClick={scrollToTop}
                className={`relative text-gray-600 hover:text-indigo-600 transition-all duration-200 font-medium font-poppins group focus:outline-none ${
                  activeSection === 'hero' ? 'text-indigo-600' : ''
                }`}
              >
                Home
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full ${
                  activeSection === 'hero' ? 'w-full' : ''
                }`}></span>
              </button>

              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => smoothScrollTo(link.id)}
                  className={`relative text-gray-600 hover:text-indigo-600 transition-all duration-200 font-medium font-poppins group focus:outline-none ${
                    activeSection === link.id ? 'text-indigo-600' : ''
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full ${
                    activeSection === link.id ? 'w-full' : ''
                  }`}></span>
                </button>
              ))}
              
              <Link 
                href="/upload"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg font-poppins focus:outline-none"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!showBackButton && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}

          {/* Back Button for Upload Page - Responsive */}
          {showBackButton && (
            <>
              {/* Desktop - Text with Icon */}
              <Link 
                href="/"
                className="hidden lg:flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 font-poppins group focus:outline-none"
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Home</span>
              </Link>
              
              {/* Mobile - Icon Only */}
              <Link 
                href="/"
                className="lg:hidden flex items-center justify-center w-10 h-10 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-poppins group focus:outline-none"
                title="Back to Home"
              >
                <svg className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {!showBackButton && (
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              {/* Home Button for Mobile */}
              <button
                onClick={scrollToTop}
                className={`block w-full text-left text-gray-600 hover:text-indigo-600 transition-all duration-200 font-medium font-poppins py-2 relative focus:outline-none ${
                  activeSection === 'hero' ? 'text-indigo-600' : ''
                }`}
              >
                Home
                {activeSection === 'hero' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
                )}
              </button>

              {navLinks.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => smoothScrollTo(link.id)}
                  className={`block w-full text-left text-gray-600 hover:text-indigo-600 transition-all duration-200 font-medium font-poppins py-2 relative focus:outline-none ${
                    activeSection === link.id ? 'text-indigo-600' : ''
                  }`}
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
                  )}
                </button>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                <Link 
                  href="/upload"
                  className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-poppins focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}