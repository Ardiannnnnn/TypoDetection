"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function AppearanceToggle({ english }: { english: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  const label = english
    ? `Switch to ${dark ? "light" : "dark"} appearance`
    : `Aktifkan tema ${dark ? "terang" : "gelap"}`;

  return <button className="appearance-toggle" onClick={() => setTheme(dark ? "light" : "dark")}
    disabled={!mounted} aria-label={label} title={label}>
    <Sun className="appearance-sun" aria-hidden="true"/>
    <Moon className="appearance-moon" aria-hidden="true"/>
  </button>;
}
