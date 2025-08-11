"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition, useEffect, useRef } from "react";
import FlagIcon from "./FlagIcon";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return; // Prevent unnecessary switch

    console.log("🔄 Switching from", locale, "to", newLocale);
    console.log("📍 Current pathname:", pathname);

    // Create new path by replacing locale
    const segments = pathname.split("/");
    console.log("📂 Path segments:", segments);

    // Replace locale segment (index 1)
    if (segments[1] && ["en", "id"].includes(segments[1])) {
      segments[1] = newLocale;
    } else {
      // If no locale in path, add it
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join("/");
    console.log("🎯 New path:", newPath);

    setIsOpen(false);

    // Use startTransition for smoother navigation
    startTransition(() => {
      router.push(newPath);
      router.refresh(); // Force refresh to ensure locale change
    });
  };

  // ✅ Updated languages with proper flags and consistent format
  const languages = [
    {
      code: "en",
      name: "English",
      flag: "US",
      fullName: "English (US)",
    },
    {
      code: "id",
      name: "Indonesia",
      flag: "ID",
      fullName: "Bahasa Indonesia",
    },
  ];

  const currentLanguage = languages.find((lang) => lang.code === locale);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ✅ Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ✅ Main Button - No focus outline */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center space-x-1 sm:space-x-2 
          px-2 sm:px-3 py-2 
          text-xs sm:text-sm 
          dark:text-white
          dark:hover:text-gray-600
          text-gray-600 hover:text-indigo-600 
          transition-all duration-200 
          rounded-lg hover:bg-gray-50 
          outline-none focus:outline-none
        
          min-w-[60px] sm:min-w-[80px]
          ${isPending ? "opacity-75 cursor-not-allowed" : "hover:scale-105"}
        `}
        disabled={isPending}
        aria-label="Switch Language"
        aria-expanded={isOpen}
      >
        {/* ✅ Flag with consistent sizing */}
        <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
          {isPending ? (
            <div className="text-[10px] sm:text-xs font-bold text-gray-700">
              ...
            </div>
          ) : (
            <FlagIcon
              country={currentLanguage?.flag || "US"}
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          )}
        </div>

        {/* ✅ Language Code - Hidden on mobile, shown on desktop */}
        <span className="hidden sm:inline-block font-medium font-poppins">
          {isPending ? "..." : currentLanguage?.code.toUpperCase()}
        </span>

        {/* ✅ Dropdown Arrow */}
        <svg
          className={`
            w-3 h-3 sm:w-4 sm:h-4 
            transition-transform duration-200 
            ${isOpen ? "rotate-180" : ""} 
            ${isPending ? "animate-spin" : ""}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* ✅ Dropdown Menu - No focus outline */}
      {isOpen && !isPending && (
        <div
          className={`
          absolute right-0 mt-2 
          w-44 sm:w-52 
          bg-white rounded-lg shadow-lg border border-gray-200 
           z-50
          transform transition-all duration-200 ease-out
          animate-in fade-in slide-in-from-top-2
        `}
        >
          {languages.map((language, index) => (
            <button
              key={language.code}
              onClick={() => switchLanguage(language.code)}
              className={`
                w-full flex items-center space-x-3 
                px-3 sm:px-4 py-2 sm:py-3
                text-xs sm:text-sm 
                hover:bg-gray-50 active:bg-gray-100
                transition-all duration-200 
                outline-none focus:outline-none
                ${
                  locale === language.code
                    ? "text-indigo-600 bg-indigo-50 font-medium"
                    : "text-gray-700 hover:text-gray-900"
                }
                ${index === 0 ? "rounded-t-lg" : ""}
                ${index === languages.length - 1 ? "rounded-b-lg" : ""}
              `}
              disabled={locale === language.code}
            >
              {/* ✅ Flag with consistent design */}
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0">
                <FlagIcon
                  country={language.flag}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </div>

              {/* ✅ Language Name - Responsive text */}
              <div className="flex-1 text-left">
                <div className="font-medium font-poppins">{language.name}</div>
                {/* ✅ Full name shown only on desktop */}
                <div className="hidden sm:block text-xs text-gray-500 font-poppins">
                  {language.fullName}
                </div>
              </div>

              {/* ✅ Current Language Indicator */}
              {locale === language.code && (
                <div className="flex-shrink-0 dark:text-white">
                  <svg
                    className="w-4 h-4 text-indigo-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Loading Overlay */}
      {isPending && (
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
