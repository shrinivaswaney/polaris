import { z } from "zod";
import { UserSessionResponseSchema } from "./session.dto.js";

// Define Zod schemas for request validation
const LoginRequestSchema = z.object({
  body: z.object({
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
const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserSessionResponseSchema,
});

// Define TypeScript types based on the Zod schemas
type LoginRequestDto = z.infer<typeof LoginRequestSchema>["body"];
type LoginResponseDto = z.infer<typeof LoginResponseSchema>;

// Function to convert user data and token into a LoginResponseDto
function toLoginResponseDto(
  user: any,
  accessToken: string,
  refreshToken: string,
): LoginResponseDto {
  return LoginResponseSchema.parse({
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
  LoginRequestSchema,
  LoginResponseSchema,
  toLoginResponseDto,
  type LoginRequestDto,
  type LoginResponseDto,
};
