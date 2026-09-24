import { useTheme } from "@wrksz/themes/client";
import React from "react";

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const colorMode = ((resolvedTheme ?? "light") === "dark" ? "dark" : "light") as "light" | "dark";
  return {
    colorMode,
    setColorMode: setTheme,
    toggleColorMode: () => setTheme(colorMode === "dark" ? "light" : "dark"),
  };
}

export function useColorModeValue<L, D>(lightValue: L, darkValue: D): L | D {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? darkValue : lightValue;
}

export const ColorModeScript: React.FC<{
  type?: string;
  initialColorMode?: string;
}> = () => null;
ColorModeScript.displayName = "ColorModeScript";
