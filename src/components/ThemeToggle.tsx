'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Debug logging
  useEffect(() => {
    console.log('🌙 Theme Debug:', { theme, resolvedTheme, mounted });
  }, [theme, resolvedTheme, mounted]);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-md border border-gray-200 dark:border-gray-700 animate-pulse bg-gray-100 dark:bg-gray-800"></div>
    );
  }

  const handleToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('🔄 Toggling theme from', theme, 'to', newTheme);
    setTheme(newTheme);
  };

  // ✅ Use resolvedTheme for accurate detection
  const currentTheme = resolvedTheme || theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      onClick={handleToggle}
      className="
        relative h-9 w-9 rounded-md border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-800
        hover:bg-gray-50 dark:hover:bg-gray-700
        transition-all duration-300 ease-in-out
        hover:scale-105 active:scale-95
        focus:outline-none
        focus:ring-0
        focus:border-indigo-500 dark:focus:border-indigo-400
        focus:shadow-lg
        overflow-hidden
      "
      style={{
        outline: 'none',
        boxShadow: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {/* ✅ Sun Icon - Show in dark mode (click to go light) */}
      <Sun 
        className={`
          absolute inset-0 m-auto h-4 w-4 text-yellow-500
          transition-all duration-500 ease-in-out
          ${isDark 
            ? 'scale-100 rotate-0 opacity-100' 
            : 'scale-0 rotate-90 opacity-0'
          }
        `} 
      />
      
      {/* ✅ Moon Icon - Show in light mode (click to go dark) */}
      <Moon 
        className={`
          absolute inset-0 m-auto h-4 w-4 text-slate-700 dark:text-slate-300
          transition-all duration-500 ease-in-out
          ${!isDark 
            ? 'scale-100 rotate-0 opacity-100' 
            : 'scale-0 -rotate-90 opacity-0'
          }
        `} 
      />

      {/* ✅ Background transition effect */}
      <div 
        className={`
          absolute inset-0 rounded-md transition-all duration-300 ease-in-out
          ${isDark 
            ? 'bg-gradient-to-tr from-slate-800 to-slate-700' 
            : 'bg-gradient-to-tr from-amber-50 to-yellow-50'
          }
          -z-10
        `}
      />

      {/* ✅ Custom focus indicator (subtle glow) */}
      <div 
        className={`
          absolute inset-0 rounded-md transition-all duration-200
          ${isDark 
            ? 'shadow-indigo-400/20' 
            : 'shadow-indigo-500/20'
          }
          opacity-0 focus-within:opacity-100
          -z-20
        `}
        style={{
          boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)'
        }}
      />
    </button>
  );
}

// ✅ Export as default juga untuk compatibility
export default ModeToggle;