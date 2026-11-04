import { z } from "zod";

// Base User payload returned to client applications
const UserSessionResponseSchema = z.object({
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
});

// Combined authentication response schema
const AuthSessionResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserSessionResponseSchema,
});

// --- Request Schemas ---
const RefreshRequestSchema = z.object({
  // If you use cookies, this validation can target req.cookies instead of req.body
  body: z.object({
    refreshToken: z.string({ error: "Refresh token is required" }),
  }),
});

const LogoutRequestSchema = z.object({
  body: z.object({
    refreshToken: z.string({ error: "Refresh token is required" }),
  }),
});

type UserSessionResponseDto = z.infer<typeof UserSessionResponseSchema>;
type AuthSessionResponseDto = z.infer<typeof AuthSessionResponseSchema>;
type RefreshRequestDto = z.infer<typeof RefreshRequestSchema>["body"];
type LogoutRequestDto = z.infer<typeof LogoutRequestSchema>["body"];

// --- Mapper Utility ---
function toAuthSessionDto(
  user: any,
  accessToken: string,
  refreshToken: string,
): AuthSessionResponseDto {
  return AuthSessionResponseSchema.parse({
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

function toUserSessionDto(user: any): UserSessionResponseDto {
  return UserSessionResponseSchema.parse({
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
  });
}

export {
  AuthSessionResponseSchema,
  LogoutRequestSchema,
  RefreshRequestSchema,
  toAuthSessionDto,
  toUserSessionDto,
  UserSessionResponseSchema,
  type AuthSessionResponseDto,
  type LogoutRequestDto,
  type RefreshRequestDto,
  type UserSessionResponseDto,
};
