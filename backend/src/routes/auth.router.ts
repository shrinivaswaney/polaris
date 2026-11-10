import bcrypt from "bcryptjs";
import "dotenv/config";
import { Router, type Request, type Response } from "express";
import { prisma } from "../db/db.js";
import {
  LoginRequestSchema,
  toLoginResponseDto,
  type LoginRequestDto,
  type LoginResponseDto,
} from "../dto/auth/login.dto.js";
import {
  SignupRequestSchema,
  toSignupResponseDto,
  type SignupRequestDto,
  type SignupResponseDto,
} from "../dto/auth/signup.dto.js";
import { validate } from "../middleware/validate.js";
import { createSession } from "./session.router.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  validate(SignupRequestSchema),
  async (
    req: Request<{}, {}, SignupRequestDto>,
    res: Response<SignupResponseDto | { error: string }>,
  ): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(409).json({ error: "User already exists" });
        return;
      }

      // Hash the password securely
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Persist the user and generate a session using a clean transaction wrapper
      const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name,
            email,
            passwordHash: hashedPassword,
            role: "USER",
            plan: "FREE",
            isActive: true,
            appTheme: "SYSTEM"
          },
        });

        // Generate JWT session token
        const tokens = await createSession(
          newUser.id,
          newUser.email,
          newUser.role,
          tx,
        );
        return { user: newUser, tokens };
      });

      res
        .status(201)
        .json(
          toSignupResponseDto(
            result.user,
            result.tokens.accessToken,
            result.tokens.refreshToken,
          ),
        );
    } catch (error) {
      console.error("Error in /signup route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

authRouter.post(
  "/login",
  validate(LoginRequestSchema),
  async (
    req: Request<{}, {}, LoginRequestDto>,
    res: Response<LoginResponseDto | { error: string }>,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ error: "Your account has been deactivated" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const result = await prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        const tokens = await createSession(
          updatedUser.id,
          updatedUser.email,
          updatedUser.role,
          tx,
        );
        return { user: updatedUser, tokens };
      });

      res
        .status(200)
        .json(
          toLoginResponseDto(
            result.user,
            result.tokens.accessToken,
            result.tokens.refreshToken,
          ),
        );
    } catch (error) {
      console.error("Error in /login route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default authRouter;
