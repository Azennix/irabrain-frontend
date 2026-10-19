"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext =
  createContext<ThemeContextValue | undefined>(
    undefined
  );

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] =
    useState<Theme>("dark");

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("irabrain-theme");

    const initialTheme =
      savedTheme === "light"
        ? "light"
        : "dark";

    setThemeState(initialTheme);

    document.documentElement.classList.toggle(
      "light",
      initialTheme === "light"
    );
  }, []);

  function setTheme(theme: Theme) {
    setThemeState(theme);

    localStorage.setItem(
      "irabrain-theme",
      theme
    );

    document.documentElement.classList.toggle(
      "light",
      theme === "light"
    );
  }

  function toggleTheme() {
    setTheme(
      theme === "dark"
        ? "light"
        : "dark"
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}