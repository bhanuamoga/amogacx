"use client";

import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";
import { motion } from "framer-motion";

/**
 * This file contains the ThemeToggle component which is used to toggle
 * between light and dark themes. It uses the next-themes library to
 * manage the theme state and framer-motion for animations.
 *
 * @file components/ThemeToggle.tsx
 * @author Son Nguyen
 * @license MIT
 * @version 1.0.0
 * @date 2025-05-11
 */

/**
 * ThemeToggle - A button component that toggles between light and dark themes.
 */
export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const current = theme === "system" ? systemTheme : theme;

  return (
    <motion.button
      onClick={() => setTheme(current === "dark" ? "light" : "dark")}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-full bg-secondary text-secondary-foreground shadow-sm focus:outline-none"
      aria-label="Toggle theme"
    >
      {current === "dark" ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </motion.button>
  );
}
