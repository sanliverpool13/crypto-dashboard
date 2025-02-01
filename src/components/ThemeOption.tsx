import React from "react";
import { Theme } from "../types/binance";
import { capitalizeString } from "../utils/helpers";

interface ThemeOption {
  type: string;
  theme: Theme;
  handleThemeChange: (type: string) => void;
}

const ThemeOption: React.FC<ThemeOption> = ({
  type,
  theme,
  handleThemeChange,
}) => {
  return (
    <button
      className={`${type === theme ? (theme === Theme.light ? `bg-[#F8F8F8] dark:bg-transparent` : "dark:bg-[#1C1C1C]") : ""}   py-1 px-4 rounded-xl`}
      onClick={() => handleThemeChange(type)}
    >
      {capitalizeString(type)}
    </button>
  );
};

export default ThemeOption;
