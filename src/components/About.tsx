'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

export default function About() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Function to render text with highlight
  // ✅ Update function di semua components
// ✅ Function yang sama untuk semua components
const renderTextWithHighlight = (text: string) => {
  return text
    .split('##HIGHLIGHT_START##')
    .map((part, index) => {
      if (index === 0) return part;
      const [highlighted, ...rest] = part.split('##HIGHLIGHT_END##');
      return (
        <span key={index}>
          <span className="text-indigo-600">{highlighted}</span>
          {rest.join('##HIGHLIGHT_END##')}
        </span>
      );
    });
};
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (cardsRef.current) observer.observe(cardsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div 
          ref={sectionRef}
          className="text-center mb-8 sm:mb-12 lg:mb-16 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 font-poppins">
            {renderTextWithHighlight(t('title'))}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-poppins px-4">
            {t('subtitle')}
          </p>
        </div>

        <div 
          ref={cardsRef}
          className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-300"
        >
          {/* Left Content - Features */}
          <div className="order-2 lg:order-1">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 font-poppins">
              {t('whyChoose')}
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 font-poppins">
                    {t('features.aiTechnology.title')}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 font-poppins">
                    {t('features.aiTechnology.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 font-poppins">
                    {t('features.security.title')}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 font-poppins">
                    {t('features.security.description')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 font-poppins">
                    {t('features.easyToUse.title')}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 font-poppins">
                    {t('features.easyToUse.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Mission & Team */}
          <div className="order-1 lg:order-2 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 rounded-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 font-poppins">
              {t('mission.title')}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed font-poppins">
              {t('mission.description')}
            </p>
            
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm sm:text-xl font-poppins">TD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 font-poppins text-sm sm:text-base">
                    {t('mission.team')}
                  </h4>
                  <p className="text-gray-600 text-xs sm:text-sm font-poppins">
                    {t('mission.role')}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm italic font-poppins">
                "{t('mission.quote')}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}