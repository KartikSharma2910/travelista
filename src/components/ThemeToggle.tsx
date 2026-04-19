import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const getInitialTheme = () => {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("theme");

  if (stored) {
    return stored === "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

const ThemeToggle = () => {
  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");

      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");

      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem("theme");

      if (!stored) {
        setDark(e.matches);
      }
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setDark((prev) => !prev);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="
      rounded-full
      transition-all
      duration-200
      active:scale-95
      "
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {dark ? (
        <Sun
          className="
          h-4 w-4
          rotate-0
          scale-100
          transition-all
          "
        />
      ) : (
        <Moon
          className="
          h-4 w-4
          rotate-0
          scale-100
          transition-all
          "
        />
      )}
    </Button>
  );
};
export default ThemeToggle;
