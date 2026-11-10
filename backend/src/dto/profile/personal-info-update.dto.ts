import { z } from "zod";

export const PasswordUpdateSchema = z.object({
  body: z.object({
    oldPassword: z.string({ error: "Current password is required" }).min(6),
    newPassword: z
      .string({ error: "New password is required" })
      .min(6)
      .max(100),
  }),
});

export const UpdateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    homeCity: z.string().optional(),
    countryCode: z
      .string()
      .length(2, "Country code must be a 2-character ISO code (e.g., IN, US)")
      .toUpperCase()
      .optional(),
    timezone: z.string().optional(),
  }),
});

export type PasswordUpdateDto = z.infer<typeof PasswordUpdateSchema>["body"];
export type ProfileUpdateDto = z.infer<
  typeof UpdateProfileSchema
>["body"];
