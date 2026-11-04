import { z } from "zod";
import {
  UserSessionResponseSchema,
  type UserSessionResponseDto,
} from "./session.dto.js";

// Define Zod schemas for request validation
const SignupRequestSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min(1, "Name must be at least 1 character")
      .max(100, "Name must be less than 100 characters"),
    email: z
      .email({ error: "Invalid email address" })
      .min(2, "Email must be at least 2 characters")
      .max(100, "Email must be less than 100 characters")
      .trim()
      .toLowerCase(),
    password: z
      .string({ error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be less than 100 characters"),
  }),
});

// Define Zod schemas for response validation
const SignupResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserSessionResponseSchema,
});

// Define TypeScript types based on the Zod schemas
type SignupRequestDto = z.infer<typeof SignupRequestSchema>["body"];
type SignupResponseDto = z.infer<typeof SignupResponseSchema>;

function toSignupResponseDto(
  user: any,
  accessToken: string,
  refreshToken: string,
): SignupResponseDto {
  return SignupResponseSchema.parse({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      locale: user.locale,
      timezone: user.timezone,
      currency: user.currency,
      isActive: user.isActive,
      createdAt:
        user.createdAt instanceof Date
          ? user.createdAt.toISOString()
          : user.createdAt,
    },
  });
}

export {
  SignupRequestSchema,
  SignupResponseSchema,
  toSignupResponseDto,
  type SignupRequestDto,
  type SignupResponseDto,
};
