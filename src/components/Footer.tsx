"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  // Fallback jika tidak ada fungsi highlight
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

  return (
    <footer className="w-full bg-gray-900 dark:bg-gray-950 border-t border-gray-700 dark:border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-white dark:text-gray-100 mb-4 font-poppins">
              {renderTextWithHighlight(
                "##HIGHLIGHT_START##TypoTrace##HIGHLIGHT_END##"
              )}
            </h3>
            <p className="text-gray-300 dark:text-gray-400 text-sm font-poppins leading-relaxed">
              {t("footer.powered")}
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-white dark:text-gray-100 mb-4 font-poppins">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    const heroSection = document.getElementById("hero");
                    if (heroSection) {
                      heroSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className="text-gray-300 dark:text-gray-400 hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 text-sm font-poppins"
                >
                  {t("navigation.home")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const aboutSection = document.getElementById("about");
                    if (aboutSection) {
                      aboutSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className="text-gray-300 dark:text-gray-400 hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 text-sm font-poppins"
                >
                  {t("navigation.about")}
                </button>
              </li>
              <li>
                <Link
                  href={`/${locale}/upload`}
                  className="text-gray-300 dark:text-gray-400 hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 text-sm font-poppins"
                >
                  Upload PDF
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    const contactSection = document.getElementById("contact");
                    if (contactSection) {
                      contactSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className="text-gray-300 dark:text-gray-400 hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 text-sm font-poppins"
                >
                  {t("navigation.contact")}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h4 className="text-lg font-semibold text-white dark:text-gray-100 mb-4 font-poppins">
              Contact
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300 dark:text-gray-400 font-poppins">
                📧 support@TypoTrace.com
              </p>
              <p className="text-gray-300 dark:text-gray-400 font-poppins">
                🌍 Indonesia
              </p>
              <p className="text-gray-300 dark:text-gray-400 font-poppins">
                ⏰ 24/7 Support
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-300 dark:text-gray-400 text-sm font-poppins">
                {t("footer.copyright")}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-300 dark:text-gray-400 text-sm font-poppins">
                  AI Service Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
