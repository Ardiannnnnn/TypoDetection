"use client";

import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("about");

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

  return (
    <section
      id="about"
      className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
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

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Content - Pain Points */}
          <div className="lg:col-span-7">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-6 font-poppins">
              {t("whyChoose")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 rounded-lg flex items-center justify-center shrink-0">
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
                  <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1.5 font-poppins">
                    {t("features.aiTechnology.title")}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-poppins">
                    {t("features.aiTechnology.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 rounded-lg flex items-center justify-center shrink-0">
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1.5 font-poppins">
                    {t("features.security.title")}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-poppins">
                    {t("features.security.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 rounded-lg flex items-center justify-center shrink-0">
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
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1.5 font-poppins">
                    {t("features.easyToUse.title")}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-poppins">
                    {t("features.easyToUse.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Mission & Team */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-4 font-poppins">
              {t("mission.title")}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-6 leading-relaxed font-poppins">
              {t("mission.description")}
            </p>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 bg-indigo-700 dark:bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold text-sm font-poppins">
                    TT
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50 font-poppins text-sm sm:text-base">
                    {t("mission.team")}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-poppins">
                    {t("mission.role")}
                  </p>
                </div>
              </div>
              <blockquote className="text-slate-600 dark:text-slate-300 text-sm italic font-poppins border-l-2 border-amber-500 pl-4">
                &ldquo;{t("mission.quote")}&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
