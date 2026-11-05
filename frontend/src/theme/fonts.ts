import type { FontFamilyDefinition } from "expo-font";

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
