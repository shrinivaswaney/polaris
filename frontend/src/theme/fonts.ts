import type { FontFamilyDefinition } from "expo-font";

/**
 * Font family names used throughout the app.
 * Keep these in sync with the aliases registered in `fontDefinitions`.
 */
export const fontFamilies = {
  heading: "ScienceGothic",
  body: "Manrope",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/**
 * Variable font files. A single file covers every weight, so headings and
 * body copy can use `fontWeight` without shipping one file per weight.
 *
 * Science Gothic also declares CTRS, slnt, and wdth axes. Use the
 * `fontVariationSettings` style prop (RN 0.88+) to reach those axes.
 */
export const fontDefinitions: FontFamilyDefinition[] = [
  {
    fontFamily: fontFamilies.body,
    fontDefinitions: [
      {
        path: require("../../assets/fonts/Manrope/Manrope-VariableFont_wght.ttf"),
        weight: "200 800",
      },
    ],
  },
  {
    fontFamily: fontFamilies.heading,
    fontDefinitions: [
      {
        path: require("../../assets/fonts/Science_Gothic/ScienceGothic-VariableFont_CTRS,slnt,wdth,wght.ttf"),
        weight: "100 900",
      },
    ],
  },
];
