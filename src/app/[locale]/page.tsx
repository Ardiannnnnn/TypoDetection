"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import HowItWorks from "@/components/Features";
import Contact from "@/components/Contact";

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
            entry.target.classList.remove("opacity-0", "translate-y-8");
            entry.target.classList.add("opacity-100", "translate-y-0");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
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

  const renderTextWithHighlight = (text: string) => {
    return text.split("##HIGHLIGHT_START##").map((part, index) => {
      if (index === 0) return part;
      const [highlighted, ...rest] = part.split("##HIGHLIGHT_END##");
      return (
        <span key={index}>
          <span className="text-indigo-600 dark:text-indigo-400 animate-pulse">
            {highlighted}
          </span>
          {rest.join("##HIGHLIGHT_END##")}
        </span>
      );
    });
  };

  const renderTitleWithLineBreak = (text: string) => {
    return text.split("##BR##").map((part, index) => (
      <span key={index}>
        {index > 0 && <br />}
        {renderTextWithHighlight(part)}
      </span>
    ));
  };

  return (
    // PERBAIKAN: Hapus fixed background, gunakan relative background
    <div className="min-h-screen font-poppins relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      
      {/* Background Decorative Elements - PERBAIKAN: Absolute, bukan fixed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Circle - Top Right */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>

        {/* Large Circle - Bottom Left */}
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Medium Circle - Center */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-gradient-to-r from-pink-400/10 to-rose-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>

        {/* Floating Squares */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-indigo-500/30 rotate-45 animate-bounce delay-300"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-500/30 rotate-45 animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-blue-500/30 rotate-45 animate-bounce delay-1000"></div>

        {/* Floating Circles */}
        <div className="absolute top-1/4 right-20 w-6 h-6 bg-cyan-500/20 rounded-full animate-ping delay-200"></div>
        <div className="absolute bottom-1/4 left-32 w-4 h-4 bg-rose-500/20 rounded-full animate-ping delay-800"></div>
      </div>

      {/* Grid Pattern - PERBAIKAN: Absolute, bukan fixed */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59,130,246,0.3) 1px, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Moving Lines - PERBAIKAN: Absolute, bukan fixed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0.1)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0.1)" />
            </linearGradient>
            <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
              <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
            </linearGradient>
          </defs>

          {/* Animated Curved Lines */}
          <path
            d="M0,500 Q250,300 500,500 T1000,500"
            stroke="url(#lineGradient1)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M0,300 Q500,100 1000,300"
            stroke="url(#lineGradient2)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse delay-1000"
          />
          <path
            d="M0,700 Q500,900 1000,700"
            stroke="url(#lineGradient1)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse delay-500"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />

        <div id="hero" className="pt-20">
          <main className="container mx-auto px-6 py-16">
            <div className="text-center max-w-4xl mx-auto">
              {/* Hero Title and Description */}
              <div
                ref={heroRef}
                className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6 font-poppins drop-shadow-lg">
                  {renderTitleWithLineBreak(t("hero.title"))}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-poppins drop-shadow-sm">
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
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2 hover:scale-105 font-poppins backdrop-blur-sm"
                  >
                    {t("hero.uploadDocument")}
                  </Link>
                  <button
                    onClick={() => {
                      const aboutSection = document.getElementById("how-it-works");
                      if (aboutSection) {
                        aboutSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-gray-700/80 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 font-poppins"
                  >
                    {t("hero.learnMore")}
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
                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-8 rounded-xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-white/20 dark:border-gray-700/50">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <svg
                        className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
                      {t("features.aiPowered.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-poppins">
                      {t("features.aiPowered.description")}
                    </p>
                  </div>

                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-8 rounded-xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 delay-100 border border-white/20 dark:border-gray-700/50">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <svg
                        className="w-8 h-8 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
                      {t("features.lightningFast.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-poppins">
                      {t("features.lightningFast.description")}
                    </p>
                  </div>

                  <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg p-8 rounded-xl shadow-lg hover:shadow-2xl dark:shadow-gray-900/50 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 delay-200 border border-white/20 dark:border-gray-700/50">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <svg
                        className="w-8 h-8 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 font-poppins">
                      {t("features.secure.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 font-poppins">
                      {t("features.secure.description")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div
                ref={statsRef}
                className="opacity-0 translate-y-8 transition-all duration-1000 ease-out delay-900"
              >
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 border border-white/20 dark:border-gray-700/50">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 font-poppins">
                    {t("stats.title")}
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 font-poppins">
                        0%
                      </div>
                      <div className="text-gray-600 dark:text-gray-300 font-poppins">
                        {t("stats.accuracy")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 font-poppins">
                        +
                      </div>
                      <div className="text-gray-600 dark:text-gray-300 font-poppins">
                        {t("stats.documents")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent mb-2 font-poppins">
                        5+
                      </div>
                      <div className="text-gray-600 dark:text-gray-300 font-poppins">
                        {t("stats.users")}
                      </div>
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
      </div>
    </div>
  );
}
