'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import HowItWorks from '@/components/Features';
import Contact from '@/components/Contact';

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-poppins">
      <Navbar />
      
      {/* Add padding-top to account for fixed navbar */}
      <div id='home' className="pt-20">
        {/* Hero Section */}
        <main className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero Title and Description */}
            <div 
              ref={heroRef}
              className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 font-poppins">
                Detect <span className="text-indigo-600 animate-pulse">Typos</span> with 
                <br />AI Precision
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-poppins">
                Upload your documents and let our advanced AI system identify and highlight 
                spelling mistakes, grammar errors, and typos with incredible accuracy.
              </p>
            </div>
            
            {/* Action Buttons */}
            <div 
              ref={buttonsRef}
              className="opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-300"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Link 
                  href="/upload"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 font-poppins"
                >
                  Upload Document
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
                  Learn More
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div 
              ref={featuresRef}
              className="opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-600"
            >
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {/* Feature 1 - AI-Powered Detection */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                  <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:scale-125 hover:bg-indigo-200 hover:rotate-12">
                    <svg className="w-8 h-8 text-indigo-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 font-poppins">AI-Powered Detection</h3>
                  <p className="text-gray-600 font-poppins">Advanced machine learning algorithms detect even the most subtle typos and grammatical errors.</p>
                </div>

                {/* Feature 2 - Lightning Fast */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 delay-100">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:scale-125 hover:bg-green-200 hover:rotate-12">
                    <svg className="w-8 h-8 text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 font-poppins">Lightning Fast</h3>
                  <p className="text-gray-600 font-poppins">Process your documents in seconds with our optimized detection engine.</p>
                </div>

                {/* Feature 3 - Secure & Private */}
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 delay-200">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:scale-125 hover:bg-purple-200 hover:rotate-12">
                    <svg className="w-8 h-8 text-purple-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 font-poppins">Secure & Private</h3>
                  <p className="text-gray-600 font-poppins">Your documents are processed securely and never stored on our servers.</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div 
              ref={statsRef}
              className="opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-900"
            >
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 font-poppins">Our Impact</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center transform hover:scale-110 transition-all duration-300">
                    <div className="text-4xl font-bold text-indigo-600 mb-2 font-poppins animate-bounce">99.8%</div>
                    <div className="text-gray-600 font-poppins">Accuracy Rate</div>
                  </div>
                  <div className="text-center transform hover:scale-110 transition-all duration-300 delay-100">
                    <div className="text-4xl font-bold text-indigo-600 mb-2 font-poppins animate-bounce">10,000+</div>
                    <div className="text-gray-600 font-poppins">Documents Processed</div>
                  </div>
                  <div className="text-center transform hover:scale-110 transition-all duration-300 delay-200">
                    <div className="text-4xl font-bold text-indigo-600 mb-2 font-poppins animate-bounce">5,000+</div>
                    <div className="text-gray-600 font-poppins">Happy Users</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* New Sections */}
        <About />
        <HowItWorks />
        <Contact />

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 border-t border-gray-200 bg-white">
          <div className="text-center text-gray-600">
            <p className="font-poppins">&copy; 2025 TypoDetector. All rights reserved.</p>
            <p className="text-sm text-gray-500 mt-2 font-poppins">
              Powered by Advanced AI Technology for Accurate Typo Detection
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}