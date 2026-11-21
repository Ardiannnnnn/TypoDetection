"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="w-full bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-bold text-indigo-400 mb-3 font-poppins">
              Check Your Paper
            </h3>
            <p className="text-slate-300 text-sm font-poppins leading-relaxed">
              {t("footer.powered")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-slate-100 mb-3 font-poppins">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("hero")}
                  className="text-slate-300 hover:text-indigo-300 transition-colors font-poppins py-1"
                >
                  {t("navigation.home")}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("about")}
                  className="text-slate-300 hover:text-indigo-300 transition-colors font-poppins py-1"
                >
                  {t("navigation.about")}
                </button>
              </li>
              <li>
                <Link
                  href={`/${locale}/upload`}
                  className="inline-block text-slate-300 hover:text-indigo-300 transition-colors font-poppins py-1"
                >
                  Upload PDF
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("contact")}
                  className="text-slate-300 hover:text-indigo-300 transition-colors font-poppins py-1"
                >
                  {t("navigation.contact")}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-semibold text-slate-100 mb-3 font-poppins">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-slate-300 font-poppins">
              <p>support@TypoTrace.com</p>
              <p>Indonesia</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm font-poppins text-center sm:text-left">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
