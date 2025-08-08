'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

export default function HowItWorks() {
  const t = useTranslations('howItWorks');
  const titleRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  // Function to render text with highlight
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

    if (titleRef.current) observer.observe(titleRef.current);
    if (stepsRef.current) observer.observe(stepsRef.current);

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: "01",
      title: t('steps.upload.title'),
      description: t('steps.upload.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      color: "indigo"
    },
    {
      number: "02", 
      title: t('steps.aiAnalysis.title'),
      description: t('steps.aiAnalysis.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "green"
    },
    {
      number: "03",
      title: t('steps.typoDetection.title'),
      description: t('steps.typoDetection.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "purple"
    },
    {
      number: "04",
      title: t('steps.getResults.title'),
      description: t('steps.getResults.description'),
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "red"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <div 
          ref={titleRef}
          className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6 font-poppins">
            {renderTextWithHighlight(t('title'))}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-poppins">
            {t('subtitle')}
          </p>
        </div>

        <div 
          ref={stepsRef}
          className="opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-300"
        >
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                )}

                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg font-poppins shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-${step.color}-100 rounded-xl flex items-center justify-center mx-auto mb-6 text-${step.color}-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center font-poppins">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed font-poppins">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">
                {t('cta.title')}
              </h3>
              <p className="text-gray-600 mb-6 font-poppins">
                {t('cta.description')}
              </p>
              
              <button 
                onClick={() => {
                  const aboutSection = document.getElementById('hero');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-lg hover:shadow-xl font-poppins"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {t('cta.button')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}