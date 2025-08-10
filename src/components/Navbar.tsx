'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle'; // ✅ Import ThemeToggle

interface NavbarProps {
  showBackButton?: boolean;
}

export default function Navbar({ showBackButton = false }: NavbarProps) {
  const t = useTranslations('navigation');
  const locale = useLocale();
  const [activeSection, setActiveSection] = useState('hero');
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
    <nav className={`navbar-base ${isScrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
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
            <span className="nav-logo text-2xl font-bold font-poppins transition-colors duration-200 group-hover:text-indigo-600">
              TypoDetector
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!showBackButton && (
            <div className="hidden lg:flex items-center space-x-8">
              {/* Home/Hero Link */}
              <button
                onClick={scrollToTop}
                className={`nav-link font-medium font-poppins group focus:outline-none transition-colors duration-200 ${
                  activeSection === 'hero' ? 'active text-indigo-600' : 'hover:text-indigo-600'
                }`}
              >
                {t('home')}
              </button>

              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => smoothScrollTo(link.id)}
                  className={`nav-link font-medium font-poppins group focus:outline-none transition-colors duration-200 ${
                    activeSection === link.id ? 'active text-indigo-600' : 'hover:text-indigo-600'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              
              <Link 
                href={`/${locale}/upload`}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg font-poppins focus:outline-none"
              >
                {t('getStarted')}
              </Link>

              {/* Right Controls */}
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {!showBackButton && (
            <div className="lg:hidden flex items-center space-x-3">
              <ThemeToggle />
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="nav-link p-2 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
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

          {/* Back Button */}
          {showBackButton && (
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <LanguageSwitcher />
              <Link 
                href={`/${locale}`}
                className="nav-link hidden lg:flex items-center space-x-2 hover:text-indigo-700 font-medium transition-colors duration-200 font-poppins group focus:outline-none"
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{t('backToHome')}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {!showBackButton && (
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}>
            <div className="mobile-menu rounded-xl shadow-lg p-6 space-y-4">
              <button
                onClick={scrollToTop}
                className={`nav-link block w-full text-left font-medium font-poppins py-2 relative focus:outline-none ${
                  activeSection === 'hero' ? 'active' : ''
                }`}
              >
                {t('home')}
              </button>

              {navLinks.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => smoothScrollTo(link.id)}
                  className={`nav-link block w-full text-left font-medium font-poppins py-2 relative focus:outline-none ${
                    activeSection === link.id ? 'active' : ''
                  }`}
                >
                  {link.label}
                </button>
              ))}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
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