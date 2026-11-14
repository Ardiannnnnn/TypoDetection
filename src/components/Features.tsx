"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();

  const renderTextWithHighlight = (text: string) => {
    return text.split("##HIGHLIGHT_START##").map((part, index) => {
      if (index === 0) return part;
      const [highlighted, ...rest] = part.split("##HIGHLIGHT_END##");
      return (
        <span key={index}>
          <span className="text-indigo-700 dark:text-indigo-400">
            {highlighted}
          </span>
          {rest.join("##HIGHLIGHT_END##")}
        </span>
      );
    });
  };

  const steps = [
    {
      number: "01",
      title: t("steps.upload.title"),
      description: t("steps.upload.description"),
    },
    {
      number: "02",
      title: t("steps.aiAnalysis.title"),
      description: t("steps.aiAnalysis.description"),
    },
    {
      number: "03",
      title: t("steps.typoDetection.title"),
      description: t("steps.typoDetection.description"),
    },
    {
      number: "04",
      title: t("steps.getResults.title"),
      description: t("steps.getResults.description"),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
    >
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="max-w-3xl mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4 font-poppins">
            {renderTextWithHighlight(t("title"))}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-poppins">
            {t("subtitle")}
          </p>
        </div>

        {/* 4-Step Editorial Workflow */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-3 font-poppins">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2 font-poppins">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-poppins">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-2 font-poppins">
              {t("cta.title")}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-poppins">
              {t("cta.description")}
            </p>
          </div>

          <Link
            href={`/${locale}/upload`}
            className="inline-flex items-center justify-center shrink-0 min-h-[44px] px-6 py-3 bg-indigo-700 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg font-semibold text-sm sm:text-base transition-colors font-poppins"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {t("cta.button")}
          </Link>
        </div>
      </div>
    </section>
  );
}
