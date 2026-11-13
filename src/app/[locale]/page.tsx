"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import HowItWorks from "@/components/Features";
import Contact from "@/components/Contact";

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  const renderTextWithHighlight = (text: string) => {
    return text.split("##HIGHLIGHT_START##").map((part, index) => {
      if (index === 0) return part;
      const [highlighted, ...rest] = part.split("##HIGHLIGHT_END##");
      return (
        <span key={index}>
          <span className="text-indigo-700 dark:text-indigo-400 underline decoration-amber-500 decoration-4 underline-offset-4">
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

  const scrollToHowItWorks = () => {
    const targetSection = document.getElementById("how-it-works");
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="min-h-screen font-poppins bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="pt-28 pb-16 sm:pt-32 sm:pb-20 border-b border-slate-200 dark:border-slate-800"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-slate-900 dark:text-slate-50 leading-tight mb-6">
                {renderTitleWithLineBreak(t("hero.title"))}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-5">
                <Link
                  href={`/${locale}/upload`}
                  className="inline-flex items-center justify-center min-h-[44px] px-7 py-3 rounded-lg text-base font-semibold bg-indigo-700 text-white hover:bg-indigo-800 active:bg-indigo-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
                >
                  {t("hero.uploadDocument")}
                </Link>

                <button
                  type="button"
                  onClick={scrollToHowItWorks}
                  className="inline-flex items-center justify-center min-h-[44px] px-7 py-3 rounded-lg text-base font-semibold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 active:bg-slate-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 transition-colors"
                >
                  {t("hero.learnMore")}
                </button>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("hero.supportedFormat")}
              </p>
            </div>

            {/* Right Column: Proofread Document Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-100/80 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                    {t("hero.preview.fileName")}
                  </span>
                  <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
                    {t("hero.preview.status")}
                  </span>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  <p className="text-sm sm:text-base leading-7 text-slate-700 dark:text-slate-300">
                    {t("hero.preview.sampleBefore")}
                    <mark className="px-1 py-0.5 rounded bg-amber-100 text-slate-900 underline decoration-amber-600 decoration-wavy underline-offset-4 dark:bg-amber-900/40 dark:text-amber-100">
                      {t("hero.preview.typoOne")}
                    </mark>
                    {t("hero.preview.sampleMiddle")}
                    <mark className="px-1 py-0.5 rounded bg-amber-100 text-slate-900 underline decoration-amber-600 decoration-wavy underline-offset-4 dark:bg-amber-900/40 dark:text-amber-100">
                      {t("hero.preview.typoTwo")}
                    </mark>
                    {t("hero.preview.sampleAfter")}
                  </p>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500 dark:text-slate-400 line-through">
                        {t("hero.preview.typoOne")}
                      </span>
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                        {t("hero.preview.fixOne")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500 dark:text-slate-400 line-through">
                        {t("hero.preview.typoTwo")}
                      </span>
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                        {t("hero.preview.fixTwo")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Capabilities: Hierarchical Split (1 Flagship + 2 Supporting) */}
          <div className="mt-14 sm:mt-16 grid lg:grid-cols-12 gap-6 items-stretch">
            {/* Flagship Capability */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center mb-5">
                  <svg
                    className="w-5 h-5 text-indigo-700 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-3">
                  {t("features.aiPowered.title")}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t("features.aiPowered.description")}
                </p>
              </div>
            </div>

            {/* Supporting Capabilities */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-indigo-700 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1.5">
                    {t("features.lightningFast.title")}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t("features.lightningFast.description")}
                  </p>
                </div>
              </div>

              <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-indigo-700 dark:text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1.5">
                    {t("features.secure.title")}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t("features.secure.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <About />
      <HowItWorks />
      <Contact />
    </div>
  );
}
