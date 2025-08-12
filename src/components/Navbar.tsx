'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import {ModeToggle} from './ThemeToggle';
import FlagIcon from './FlagIcon';

interface NavbarProps {
  showBackButton?: boolean;
}

export default function Navbar({ showBackButton = false }: NavbarProps) {
  const t = useTranslations('navigation');
  const locale = useLocale();
   const router = useRouter(); 
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false); // ✅ New state for mobile controls
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (pathname === `/${locale}` || pathname === '/') {
        const sections = ['hero', 'about', 'how-it-works', 'contact'];
        let currentSection = 'hero';

        for (let i = sections.length - 1; i >= 0; i--) {
          const element = document.getElementById(sections[i]);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 120) {
              currentSection = sections[i];
              break;
            }
          }
        }
        
        setActiveSection(currentSection);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, locale]);

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
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
    setActiveSection('hero');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === `/${locale}` || pathname === '/') {
      e.preventDefault();
      scrollToTop();
    }
  };

  const navLinks = [
    { id: 'about', label: t('about'), href: '#about' },
    { id: 'how-it-works', label: t('howItWorks'), href: '#how-it-works' },
    { id: 'contact', label: t('contact'), href: '#contact' },
  ];

  // ✅ Close mobile controls when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMobileControlsOpen(false);
    };

    if (isMobileControlsOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileControlsOpen]);

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 
      transition-all duration-300 font-poppins
      ${isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700' 
        : 'bg-transparent'
      }
    `}>
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href={`/${locale}`}
            onClick={handleLogoClick}
            className="flex items-center space-x-2 z-10 group cursor-pointer focus:outline-none"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:rotate-3">
              <span className="text-white font-bold text-base sm:text-lg font-poppins">T</span>
            </div>
            <span className={`text-xl sm:text-2xl font-bold font-poppins transition-colors duration-200 group-hover:text-indigo-600 ${
              isScrolled 
                ? 'text-gray-800 dark:text-white' 
                : 'text-gray-800 dark:text-white'
            }`}>
              <span className="hidden sm:inline">TypoDetector</span>
              <span className="sm:hidden">TypoDetector</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!showBackButton && (
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {/* Home/Hero Link */}
              <button
                onClick={scrollToTop}
                className={`relative transition-all duration-200 font-medium font-poppins group focus:outline-none ${
                  activeSection === 'hero' 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : isScrolled 
                      ? 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {t('home')}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 ${
                  activeSection === 'hero' ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>

              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => smoothScrollTo(link.id)}
                  className={`relative transition-all duration-200 font-medium font-poppins group focus:outline-none ${
                    activeSection === link.id 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : isScrolled 
                        ? 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                        : 'text-gray-700 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 ${
                    activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </button>
              ))}
              
              <Link 
                href={`/${locale}/upload`}
                className="bg-indigo-600 text-white px-4 xl:px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg font-poppins focus:outline-none text-sm xl:text-base"
              >
                {t('getStarted')}
              </Link>

              {/* Desktop Controls */}
              <div className="flex items-center space-x-2 xl:space-x-3">
                <ModeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          )}

          {/* Mobile Controls */}
          {!showBackButton && (
            <div className="lg:hidden flex items-center space-x-2">
              {/* ✅ Mobile Controls Toggle */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileControlsOpen(!isMobileControlsOpen);
                  }}
                  className={`p-2 rounded-lg transition-all duration-200 focus:outline-none ${
                    isMobileControlsOpen
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : isScrolled 
                        ? 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  aria-label="Settings"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {/* ✅ Mobile Controls Dropdown */}
                {isMobileControlsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 font-poppins">Settings</p>
                    </div>
                    
                    {/* Theme Toggle Row */}
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-poppins">Theme</span>
                      </div>
                      <ModeToggle />
                    </div>

                    {/* ✅ Language Toggle Row - CUSTOM IMPLEMENTATION untuk Mobile */}
                    <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-poppins">Language</span>
                        </div>
                      </div>
                      
                      {/* ✅ Custom Language Buttons untuk Mobile */}
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            if (locale !== 'en') {
                              const segments = pathname.split("/");
                              if (segments[1] && ["en", "id"].includes(segments[1])) {
                                segments[1] = 'en';
                              } else {
                                segments.splice(1, 0, 'en');
                              }
                              const newPath = segments.join("/");
                              router.push(newPath);
                              setIsMobileControlsOpen(false);
                            }
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                            locale === 'en' 
                              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
                              : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <FlagIcon country="US" className="w-5 h-5" />
                          </div>
                          <span className="flex-1 text-left font-medium font-poppins">English</span>
                          {locale === 'en' && (
                            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                        
                        <button
                          onClick={() => {
                            if (locale !== 'id') {
                              const segments = pathname.split("/");
                              if (segments[1] && ["en", "id"].includes(segments[1])) {
                                segments[1] = 'id';
                              } else {
                                segments.splice(1, 0, 'id');
                              }
                              const newPath = segments.join("/");
                              router.push(newPath);
                              setIsMobileControlsOpen(false);
                            }
                          }}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                            locale === 'id' 
                              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800' 
                              : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <FlagIcon country="ID" className="w-5 h-5" />
                          </div>
                          <span className="flex-1 text-left font-medium font-poppins">Indonesia</span>
                          {locale === 'id' && (
                            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Get Started Button in Mobile */}
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600 mt-2">
                      <Link 
                        href={`/${locale}/upload`}
                        className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-poppins text-sm"
                        onClick={() => setIsMobileControlsOpen(false)}
                      >
                        {t('getStarted')}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none ${
                  isScrolled 
                    ? 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}

          {/* Back Button with Mobile Controls */}
          {showBackButton && (
            <div className="flex items-center space-x-2">
              {/* ✅ Mobile Controls for Upload Page - FIXED VERSION */}
              <div className="lg:hidden relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMobileControlsOpen(!isMobileControlsOpen);
                  }}
                  className={`p-2 rounded-lg transition-all duration-200 focus:outline-none ${
                    isMobileControlsOpen
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>

                {isMobileControlsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-600">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 font-poppins">Settings</p>
                    </div>
                    
                    {/* Theme Row */}
                    <div className="px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-poppins">Theme</span>
                      <ModeToggle />
                    </div>

                    {/* ✅ Language Row - Custom Implementation */}
                    <div className="px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-700 dark:text-gray-300 font-poppins">Language</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            if (locale !== 'en') {
                              const segments = pathname.split("/");
                              if (segments[1] && ["en", "id"].includes(segments[1])) {
                                segments[1] = 'en';
                              } else {
                                segments.splice(1, 0, 'en');
                              }
                              const newPath = segments.join("/");
                              router.push(newPath);
                              setIsMobileControlsOpen(false);
                            }
                          }}
                          className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1 rounded text-xs transition-colors duration-200 ${
                            locale === 'en' 
                              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <FlagIcon country="US" className="w-3 h-3" />
                          <span className="font-poppins">EN</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            if (locale !== 'id') {
                              const segments = pathname.split("/");
                              if (segments[1] && ["en", "id"].includes(segments[1])) {
                                segments[1] = 'id';
                              } else {
                                segments.splice(1, 0, 'id');
                              }
                              const newPath = segments.join("/");
                              router.push(newPath);
                              setIsMobileControlsOpen(false);
                            }
                          }}
                          className={`flex-1 flex items-center justify-center space-x-1 px-2 py-1 rounded text-xs transition-colors duration-200 ${
                            locale === 'id' 
                              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          <FlagIcon country="ID" className="w-3 h-3" />
                          <span className="font-poppins">ID</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Controls */}
              <div className="hidden lg:flex items-center space-x-3">
                <ModeToggle />
                <LanguageSwitcher />
              </div>

              {/* Back Button */}
              <Link 
                href={`/${locale}`}
                className={`hidden lg:flex items-center space-x-2 font-medium transition-colors duration-200 font-poppins group focus:outline-none ${
                  'text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300'
                }`}
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>{t('backToHome')}</span>
              </Link>
              
              {/* Mobile Back Button */}
              <Link 
                href={`/${locale}`}
                className={`lg:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 font-poppins group focus:outline-none text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-gray-800`}
                title={t('backToHome')}
              >
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {!showBackButton && (
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}>
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              {/* Home Button for Mobile */}
              <button
                onClick={scrollToTop}
                className={`block w-full text-left transition-all duration-200 font-medium font-poppins py-2 relative focus:outline-none text-sm ${
                  activeSection === 'hero' 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {t('home')}
                {activeSection === 'hero' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"></span>
                )}
              </button>

              {navLinks.map((link, index) => (
                <button
                  key={link.id}
                  onClick={() => smoothScrollTo(link.id)}
                  className={`block w-full text-left transition-all duration-200 font-medium font-poppins py-2 relative focus:outline-none text-sm ${
                    activeSection === link.id 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}