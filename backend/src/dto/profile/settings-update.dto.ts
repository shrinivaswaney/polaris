import z from "zod";

export const AvatarUpdateSchema = z.object({
  body: z.object({
    avatarUrl: z.url("Invalid URL format"),
  }),
});

export const UpdateLocaleSchema = z.object({
  body: z.object({
    locale: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, {
      error:
        "Invalid locale format. Expected ISO-639 style (e.g., 'en', 'hi', 'en-IN').",
    }),
  }),
});

export const UpdateThemeSchema = z.object({
  body: z.object({
    theme: z.enum(["DARK", "LIGHT", "SYSTEM"], {
      error: "Invalid theme format. Expected DARK/LIGHT/SYSTEM.",
    }),
  }),
});

export const UpdateCurrencySchema = z.object({
  body: z.object({
    currency: z
      .string()
      .length(
        3,
        "Currency must be exactly a 3-character ISO code (e.g., INR, USD)",
      )
      .toUpperCase(),
  }),
});

export type UpdateLocaleDto = z.infer<typeof UpdateLocaleSchema>["body"];
export type UpdateThemeDto = z.infer<typeof UpdateThemeSchema>["body"];
export type UpdateCurrencyDto = z.infer<typeof UpdateCurrencySchema>["body"];
