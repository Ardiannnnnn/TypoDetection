"use client"

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import HowItWorks from '@/components/Features';
import Contact from '@/components/Contact';

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const heroRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const elements = [heroRef, buttonsRef, featuresRef, statsRef];
    elements.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  // ✅ Updated function to handle safe placeholders
  const renderTextWithHighlight = (text: string) => {
    return text
      .split('##HIGHLIGHT_START##')
      .map((part, index) => {
        if (index === 0) return part;
        const [highlighted, ...rest] = part.split('##HIGHLIGHT_END##');
        return (
          <span key={index}>
            <span className="text-indigo-600 animate-pulse">{highlighted}</span>
            {rest.join('##HIGHLIGHT_END##')}
          </span>
        );
      });
  };

  const renderTitleWithLineBreak = (text: string) => {
    return text.split('##BR##').map((part, index) => (
      <span key={index}>
        {index > 0 && <br />}
        {renderTextWithHighlight(part)}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 dark:bg-black to-indigo-100 font-poppins">
      <Navbar />
      
      <div id="hero" className="pt-20">
        <main className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero Title and Description */}
            <div 
              ref={heroRef}
              className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-poppins">
                {renderTitleWithLineBreak(t("hero.title"))}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-poppins">
                {t("hero.subtitle")}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div 
              ref={buttonsRef}
              className="opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-300"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link 
                  href={`/${locale}/upload`}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 font-poppins"
                >
                  {t('hero.uploadDocument')}
                </Link>
                <button 
                  onClick={() => {
                    const aboutSection = document.getElementById('about');
                    if (aboutSection) {
                      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 font-poppins"
                >
                  {t('hero.learnMore')}
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div 
              ref={featuresRef}
              className="opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-600"
            >
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {/* Feature Cards */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                  <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 font-poppins">
                    {t('features.aiPowered.title')}
                  </h3>
                  <p className="text-gray-600 font-poppins">
                    {t('features.aiPowered.description')}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 delay-100">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 font-poppins">
                    {t('features.lightningFast.title')}
                  </h3>
                  <p className="text-gray-600 font-poppins">
                    {t('features.lightningFast.description')}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 delay-200">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 font-poppins">
                    {t('features.secure.title')}
                  </h3>
                  <p className="text-gray-600 font-poppins">
                    {t('features.secure.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div 
              ref={statsRef}
              className="opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-900"
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-poppins">
                  {t('stats.title')}
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2 font-poppins">99.8%</div>
                    <div className="text-gray-600 font-poppins">{t('stats.accuracy')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2 font-poppins">10,000+</div>
                    <div className="text-gray-600 font-poppins">{t('stats.documents')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 mb-2 font-poppins">5,000+</div>
                    <div className="text-gray-600 font-poppins">{t('stats.users')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <About />
        <HowItWorks />
        <Contact />
      </div>

      {/* ✅ Footer Full Width */}
      <footer className="w-full bg-gray-900 border-t border-gray-700">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-white mb-4 font-poppins">
                {renderTextWithHighlight("##HIGHLIGHT_START##TypoDetector##HIGHLIGHT_END##")}
              </h3>
              <p className="text-gray-300 text-sm font-poppins leading-relaxed">
                {t('footer.powered')}
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-1">
              <h4 className="text-lg font-semibold text-white mb-4 font-poppins">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => {
                      const heroSection = document.getElementById('hero');
                      if (heroSection) {
                        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm font-poppins"
                  >
                    {t('navigation.home')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const aboutSection = document.getElementById('about');
                      if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm font-poppins"
                  >
                    {t('navigation.about')}
                  </button>
                </li>
                <li>
                  <Link 
                    href={`/${locale}/upload`}
                    className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm font-poppins"
                  >
                    Upload PDF
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      const contactSection = document.getElementById('contact');
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="text-gray-300 hover:text-indigo-400 transition-colors duration-200 text-sm font-poppins"
                  >
                    {t('navigation.contact')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-1">
              <h4 className="text-lg font-semibold text-white mb-4 font-poppins">
                Contact
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300 font-poppins">
                  📧 support@typodetector.com
                </p>
                <p className="text-gray-300 font-poppins">
                  🌍 Indonesia
                </p>
                <p className="text-gray-300 font-poppins">
                  ⏰ 24/7 Support
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-300 text-sm font-poppins">
                  {t('footer.copyright')}
                </p>
              </div>
              
              {/* Social Links or Additional Info */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-300 text-sm font-poppins">
                    AI Service Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 