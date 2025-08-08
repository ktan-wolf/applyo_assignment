// @ts-nocheck
"use client";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (!savedTheme) {
      // Default to system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <button 
      className="btn" 
      onClick={toggleTheme} 
      title="Toggle dark mode"
      style={{
        background: darkMode ? "#334155" : "#e5e7eb",
        color: darkMode ? "#f1f5f9" : "#0f172a",
        border: "1px solid #cbd5e1"
      }}
    >
      {darkMode ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
