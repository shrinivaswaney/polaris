import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../db/db.js";
import {
  LogoutRequestSchema,
  RefreshRequestSchema,
  toAuthSessionDto,
  toUserSessionDto,
  type AuthSessionResponseDto,
  type LogoutRequestDto,
  type RefreshRequestDto,
  type UserSessionResponseDto,
} from "../dto/auth/session.dto.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";

const sessionRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRES = 3600; // 1 hour

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Helper function to generate structural session credentials
async function createSession(
  userId: string,
  email: string,
  role: string,
  tx: any,
  existingFamilyId?: string,
) {
  const accessToken = jwt.sign({ userId, email, role }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });

  const rawRefreshToken = randomBytes(40).toString("hex");
  const tokenHash = hashToken(rawRefreshToken);

  const familyId = existingFamilyId || randomBytes(16).toString("hex");

  // Expiry timestamp matches typical 30 day lifespan constraints
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30-day expiration policy

  await tx.refreshToken.create({
    data: {
      userId,
      familyId,
      tokenHash,
      expiresAt,
    },
  });

  return { accessToken, refreshToken: rawRefreshToken };
}

sessionRouter.post(
  "/refresh",
  validate(RefreshRequestSchema),
  async (
    req: Request<{}, {}, RefreshRequestDto>,
    res: Response<AuthSessionResponseDto | { error: string }>,
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const targetHash = hashToken(refreshToken);

      const sessionData = await prisma.$transaction(
        async (tx: {
          refreshToken: {
            findUnique: (arg0: {
              where: { tokenHash: string };
              include: { user: boolean };
            }) => any;
            updateMany: (arg0: {
              where: { familyId: any };
              data: { revokedAt: Date };
            }) => any;
            update: (arg0: {
              where: { id: any };
              data: { revokedAt: Date; lastUsedAt: Date };
            }) => any;
          };
        }) => {
          const storedToken = await tx.refreshToken.findUnique({
            where: { tokenHash: targetHash },
            include: { user: true },
          });

          if (storedToken && storedToken.revokedAt) {
            // Breach protocol: Revoke all tokens belonging to this family instantly
            await tx.refreshToken.updateMany({
              where: { familyId: storedToken.familyId },
              data: { revokedAt: new Date() },
            });
            return "BREACH";
          }

          if (
            !storedToken ||
            storedToken.expiresAt < new Date() ||
            !storedToken.user.isActive
          ) {
            return null;
          }

          // Mark the current token as used/revoked
          await tx.refreshToken.update({
            where: { id: storedToken.id },
            data: {
              revokedAt: new Date(),
              lastUsedAt: new Date(),
            },
          });

          const tokens = await createSession(
            storedToken.user.id,
            storedToken.user.email,
            storedToken.user.role,
            tx,
            storedToken.familyId,
          );

          return { tokens, user: storedToken.user };
        },
      );

      if (sessionData === "BREACH" || !sessionData) {
        res
          .status(401)
          .json({ error: "Access denied. Invalid session state." });
        return;
      }

      res
        .status(200)
        .json(
          toAuthSessionDto(
            sessionData.user,
            sessionData.tokens.accessToken,
            sessionData.tokens.refreshToken,
          ),
        );
    } catch (error) {
      console.error("Refresh sequence error:", error);
      res
        .status(500)
        .json({ error: "Internal server error during token refresh" });
    }
  },
);

sessionRouter.post(
  "/logout",
  validate(LogoutRequestSchema),
  async (
    req: Request<{}, {}, LogoutRequestDto>,
    res: Response<{ message: string } | { error: string }>,
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      const targetHash = hashToken(refreshToken);

      // Perform a clean, error-safe direct removal by targeting unique tokenHash constraints
      await prisma.refreshToken
        .delete({
          where: { tokenHash: targetHash },
        })
        .catch(() => null);

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout runtime error:", error);
      res.status(500).json({ error: "Internal server error during logout" });
    }
  },
);

sessionRouter.get(
  "/me",
  authenticate,
  async (
    req: Request,
    res: Response<UserSessionResponseDto | { error: string }>,
  ): Promise<void> => {
    try {
      const userContext = req.user!;

      const user = await prisma.user.findUnique({
        where: { id: userContext.userId },
      });

      if (!user || !user.isActive) {
        res.status(404).json({ error: "User profile not found or inactive" });
        return;
      }

      res.status(200).json(toUserSessionDto(user));
    } catch (error) {
      console.error("Profile evaluation error:", error);
      res
        .status(500)
        .json({ error: "Internal server error retrieving user context" });
    }
  },
);

export { createSession, hashToken };
export default sessionRouter;
