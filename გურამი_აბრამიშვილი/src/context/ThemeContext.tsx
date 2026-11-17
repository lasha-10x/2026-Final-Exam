import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Theme } from "@/types/catalog";
import { StorageService } from "@/models/StorageService";
import { isTheme } from "@/utils/guards";
import { STORAGE_KEYS } from "@/utils/constants";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const themeStorage = new StorageService<Theme>(STORAGE_KEYS.theme, isTheme);

function getInitialTheme(): Theme {
  const saved = themeStorage.get();
  if (saved !== null) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // data-theme on <html> switches the CSS variables defined in index.css.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    themeStorage.set(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
