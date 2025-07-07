import { setCookie } from "@/app/actions";
import { handleAsync } from "@/utils/async-handler";
import { useTheme } from "next-themes";
import { useCallback } from "react";

export const useThemes = () => {
  const { setTheme, theme } = useTheme();

  const toggleTheme = useCallback(async () => {
    const currentTheme = theme === "dark" ? "light" : "dark";
    await handleAsync(setCookie)("theme", currentTheme);
    setTheme(currentTheme);
  }, [setTheme, theme]);

  return { toggleTheme, theme };
};
