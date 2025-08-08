'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher'; // ✅ Fix import path

interface NavbarProps {
  showBackButton?: boolean;
}

export default function Navbar({ showBackButton = false }: NavbarProps) {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const [activeSection, setActiveSection] = useState('hero'); // ✅ Default ke hero
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // ✅ Hanya detect scroll di homepage
      if (pathname === `/${locale}` || pathname === '/') {
        // ✅ Update section IDs sesuai dengan yang ada di DOM
        const sections = ['hero', 'about', 'how-it-works', 'contact'];
        let currentSection = 'hero'; // Default

        // ✅ Improved scroll detection logic
        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.getElementById(sections[i]);
          if (element) {
            const rect = element.getBoundingClientRect();
            // ✅ Check if section is in viewport (dengan offset untuk navbar)
            if (rect.top <= 120) {
              currentSection = sections[i];
              break;
            }
          }
        }
        
        setActiveSection(currentSection);
      }
    };

    // ✅ Initial call untuk set active section
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, locale]);

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offsetTop = element.offsetTop - 100; // ✅ Adjust offset
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setActiveSection('hero'); // ✅ Set active ke hero saat scroll to top
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === `/${locale}` || pathname === '/') {
      e.preventDefault();
      scrollToTop();
    }
  };

  // ✅ Update nav links dengan ID yang benar
  const navLinks = [
    { id: 'about', label: t('about'), href: '#about' },
    { id: 'how-it-works', label: t('howItWorks'), href: '#how-it-works' }, // ✅ Pastikan ID ini match dengan section
    { id: 'contact', label: t('contact'), href: '#contact' },
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
            href={`/${locale}`}
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
                {t('home')}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
                  activeSection === 'hero' ? 'w-full' : 'w-0 group-hover:w-full'
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
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-600 transition-all duration-300 ${
                    activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
              ))}
              
              <Link 
                href={`/${locale}/upload`}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg font-poppins focus:outline-none"
              >
                {t('getStarted')}
              </Link>

              {/* Language Switcher */}
              <LanguageSwitcher />
            </div>
          )}

          {/* Mobile Menu Button */}
          {!showBackButton && (
            <div className="lg:hidden flex items-center space-x-4">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}

          {/* Back Button for Upload Page - Responsive */}
          {showBackButton && (
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              {/* Desktop - Text with Icon */}
              <Link 
                href={`/${locale}`}
                className="hidden lg:flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 font-poppins group focus:outline-none"
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{t('backToHome')}</span>
              </Link>
              
              {/* Mobile - Icon Only */}
              <Link 
                href={`/${locale}`}
                className="lg:hidden flex items-center justify-center w-10 h-10 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200 font-poppins group focus:outline-none"
                title={t('backToHome')}
              >
                <svg className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
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
                {t('home')}
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
                  href={`/${locale}/upload`}
                  className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-poppins focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('getStarted')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}