import React, { useState, useEffect } from "react";
import { Theme } from "../types/binance";
import { getTheme } from "../utils/helpers";
import { themeOptions } from "../utils/constants";
import ThemeOption from "./ThemeOption";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(getTheme());

  useEffect(() => {
    switch (theme) {
      case Theme.dark:
        document.documentElement.classList.add("dark");
        return;
      case Theme.light:
        document.documentElement.classList.remove("dark");
        return;
      default:
        return;
    }
  }, [theme]);

  const handleThemeChange = (type: string) => {
    let newTheme = Theme.system;
    if (type === Theme.system) {
      localStorage.removeItem("theme");
      document.documentElement.classList.toggle(
        "dark",
        localStorage.theme === "dark" ||
          (!("theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches),
      );
    } else if (type === Theme.light) {
      localStorage.setItem("theme", Theme.light);
      newTheme = Theme.light;
    } else {
      localStorage.setItem("theme", Theme.dark);
      newTheme = Theme.dark;
    }
    setTheme(newTheme);
  };

  return (
    <div className="px-0.5 py-0.5 rounded-xl bg-[#E5E5E5] dark:bg-[#393939]">
      {themeOptions &&
        themeOptions.map((option: string) => {
          return (
            <ThemeOption
              key={option}
              type={option}
              handleThemeChange={handleThemeChange}
              theme={theme}
            />
          );
        })}
    </div>
  );
};

export default ThemeToggle;
