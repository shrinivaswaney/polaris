import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";

import { themes, type AppTheme, type ThemeMode } from "./tokens";

type ThemeContextValue = {
  theme: AppTheme;
  mode: ThemeMode;
};

export type ThemeProviderProps = PropsWithChildren<{
  /** Force a theme mode. Defaults to the system color scheme. */
  mode?: ThemeMode;
}>;

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Provides the active theme (light/dark) to the whole app.
 * Wrap the app once, near the root layout.
 */
export function ThemeProvider({
  children,
  mode: forcedMode,
}: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const mode: ThemeMode =
    forcedMode ?? (colorScheme === "dark" ? "dark" : "light");

  const value = useMemo(() => ({ theme: themes[mode], mode }), [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/** Access the active theme tokens. Must be used inside a `ThemeProvider`. */
export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }

  return value;
}
