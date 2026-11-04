import { z } from "zod";

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
  token: z.string(),
  user: z.object({
    id: z.uuid(),
    name: z.string().nullable(),
    email: z.email(),
    role: z.enum(["USER", "ADMIN"]),
    plan: z.enum(["FREE", "PRO"]),
    locale: z.string(),
    timezone: z.string(),
    currency: z.string(),
    isActive: z.boolean(),
    createdAt: z.string(),
  }),
});

// Define TypeScript types based on the Zod schemas
type SignupRequestDto = z.infer<typeof SignupRequestSchema>["body"];
type SignupResponseDto = z.infer<typeof SignupResponseSchema>;

// Function to convert user data and token into a SignupResponseDto
function toSignupResponseDto(user: any, token: string): SignupResponseDto {
  return SignupResponseSchema.parse({
    token,
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
