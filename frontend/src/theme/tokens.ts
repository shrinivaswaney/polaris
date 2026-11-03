import type { TextStyle } from "react-native";

import { fontFamilies } from "./fonts";

/* -------------------- CORE TYPES -------------------- */

export type ThemeMode = "light" | "dark";

/* -------------------- TYPOGRAPHY -------------------- */

const fontFamily = {
  heading: fontFamilies.heading,
  body: fontFamilies.body,
  display: fontFamilies.heading,
} as const;

const fontSize = {
  caption: 12,
  label: 11,
  bodySmall: 14,
  body: 16,
  button: 16,
  title: 18,
  quote: 20,
  h3: 24,
  h2: 32,
  h1: 44,
  display: 56,
} as const;

const lineHeight = {
  caption: 16,
  label: 14,
  bodySmall: 22,
  body: 26,
  button: 20,
  title: 24,
  quote: 30,
  h3: 30,
  h2: 38,
  h1: 48,
  display: 60,
} as const;

const letterSpacing = {
  normal: 0,
  heading: -0.5,
  headingTight: -0.25,
  editorial: 1.6,
} as const;

const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/**
 * Ready-to-use text styles.
 *
 * Science Gothic  -> display, h1, h2, h3, quote
 * Manrope         -> body, bodySmall, caption, label, button
 *
 * Science Gothic axes: CTRS 0–85, slnt -10–0, wdth 50–200, wght 100–900.
 * Add `fontVariationSettings` to a style to use an axis beyond weight/slant.
 */
export const textStyles = {
  display: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.display,
    lineHeight: lineHeight.display,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.heading,
  },
  h1: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h1,
    lineHeight: lineHeight.h1,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.heading,
  },
  h2: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h2,
    lineHeight: lineHeight.h2,
    fontWeight: fontWeight.bold,
    letterSpacing: letterSpacing.headingTight,
  },
  h3: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h3,
    lineHeight: lineHeight.h3,
    fontWeight: fontWeight.semibold,
  },
  quote: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.quote,
    lineHeight: lineHeight.quote,
    fontWeight: fontWeight.regular,
    fontStyle: "italic",
    // Science Gothic's slnt axis runs from -10 to 0; this makes the italic
    // consistent on Android and web as well as iOS.
    fontVariationSettings: "'slnt' -10",
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    lineHeight: lineHeight.body,
    fontWeight: fontWeight.regular,
  },
  bodySmall: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.bodySmall,
    lineHeight: lineHeight.bodySmall,
    fontWeight: fontWeight.regular,
  },
  caption: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption,
    lineHeight: lineHeight.caption,
    fontWeight: fontWeight.medium,
  },
  label: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.label,
    lineHeight: lineHeight.label,
    fontWeight: fontWeight.semibold,
    letterSpacing: letterSpacing.editorial,
    textTransform: "uppercase",
  },
  button: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.button,
    lineHeight: lineHeight.button,
    fontWeight: fontWeight.semibold,
  },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textStyles;

const base = {
  spacing: (n: number): number => n * 4,

  radius: {
    none: 0,
    sm: 2,
    md: 3,
    lg: 4,
    full: 9999,
  },

  typography: {
    fontFamily,
    fontSize,
    lineHeight,
    letterSpacing,
    fontWeight,
    textStyles,
  },

  elevation: {
    none: "none",
    ambient: "0 8px 40px rgba(0, 0, 0, 0.04)",
  },

  glass: {
    blur: "20px",
    opacity: 0.7,
  },

  components: {
    button: {
      radius: 12,
      paddingX: "1.4rem",
      paddingY: "1rem",
    },

    input: {
      radius: 12,
      borderStyle: "bottom-only" as const,
    },

    card: {
      radius: 8,
      shadow: "none",
    },

    navigation: {
      blur: "20px",
      opacity: 0.7,
    },
  },
};

/* -------------------- THEME INTERFACE -------------------- */

export interface AppTheme {
  spacing: typeof base.spacing;
  radius: typeof base.radius;
  typography: typeof base.typography;
  elevation: typeof base.elevation;
  glass: typeof base.glass;
  components: typeof base.components;

  colors: {
    primary: string;
    onPrimary: string;

    background: string;
    surface: string;
    surfaceDim: string;

    surfaceContainerLowest: string;
    surfaceContainerLow: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;

    text: string;
    muted: string;

    border: string;
    outlineVariant: string;

    placeholder: string;
  };
}

/* -------------------- LIGHT THEME -------------------- */

export const lightTheme: AppTheme = {
  ...base,

  colors: {
    primary: "#000000",
    onPrimary: "#E2E2E2",

    background: "#F9F9F9",
    surface: "#F9F9F9",
    surfaceDim: "#DADADA",

    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#F3F3F3",
    surfaceContainer: "#EEEEEE",
    surfaceContainerHigh: "#E5E5E5",

    text: "#1B1B1B",
    muted: "#6B6B6B",

    border: "rgba(198, 198, 198, 0.15)",
    outlineVariant: "#C6C6C6",

    placeholder: "#DADADA",
  },
};

/* -------------------- DARK THEME -------------------- */

/*
  Dark palette is an adapted interpretation of the
  editorial design language. DESIGN.md specifies the
  light palette but does not provide dark-mode values.
*/

export const darkTheme: AppTheme = {
  ...base,

  colors: {
    primary: "#FFFFFF",
    onPrimary: "#1B1B1B",

    background: "#121212",
    surface: "#121212",
    surfaceDim: "#080808",

    surfaceContainerLowest: "#1C1C1C",
    surfaceContainerLow: "#242424",
    surfaceContainer: "#2A2A2A",
    surfaceContainerHigh: "#333333",

    text: "#F5F5F5",
    muted: "#A3A3A3",

    border: "rgba(255, 255, 255, 0.15)",
    outlineVariant: "#666666",

    placeholder: "#333333",
  },
};

/* -------------------- THEME EXPORTS -------------------- */

export const themes: Record<ThemeMode, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};

export default lightTheme;
