"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse bg-gray-100 dark:bg-gray-800"></div>
    );
  }

  const handleToggle = () => {
    if (isTransitioning) return; // Prevent double clicks

    setIsTransitioning(true);
    const html = document.documentElement;

    // ✅ Shorter transition untuk mobile
    html.classList.add("theme-transition");

    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    // ✅ Faster cleanup untuk mobile performance
    setTimeout(() => {
      html.classList.remove("theme-transition");
      setIsTransitioning(false);
    }, 300); // Reduced dari 500ms ke 300ms
  };

  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === "dark";

  return (
    <button
      onClick={handleToggle}
      disabled={isTransitioning}
      className="
        relative h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-800
        hover:bg-gray-50 dark:hover:bg-gray-700
        transition-all duration-200 ease-out
        active:scale-90 sm:hover:scale-105 sm:active:scale-95
        focus:outline-none
        disabled:opacity-70
        touch-manipulation
      "
      style={{
        outline: "none",
        boxShadow: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* ✅ Simplified animations untuk mobile */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          className={`
            absolute h-3 w-3 sm:h-4 sm:w-4 text-yellow-500
            transition-all duration-300 ease-out
            ${
              isDark
                ? "scale-100 opacity-100"
                : "scale-0 opacity-0"
            }
          `}
        />

        {/* Moon Icon */}
        <Moon
          className={`
            absolute h-3 w-3 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-300
            transition-all duration-300 ease-out
            ${
              !isDark
                ? "scale-100 opacity-100"
                : "scale-0 opacity-0"
            }
          `}
        />
      </div>

      {/* ✅ Simplified background effect - only for desktop */}
      <div
        className={`
          absolute inset-0 rounded-lg transition-all duration-200 ease-out
          hidden sm:block
          ${
            isDark
              ? "bg-slate-100/5"
              : "bg-yellow-100/20"
          }
          opacity-0 hover:opacity-100
        `}
      />

      {/* ✅ Mobile-specific active state */}
      <div
        className={`
          absolute inset-0 rounded-lg transition-all duration-150 ease-out
          sm:hidden
          ${isTransitioning ? "bg-gray-200 dark:bg-gray-600" : ""}
          ${isDark ? "bg-blue-500/10" : "bg-yellow-500/10"}
          opacity-0 active:opacity-100
        `}
      />
    </button>
  );
}

export default ModeToggle;
