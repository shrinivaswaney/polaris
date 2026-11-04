import bcrypt from "bcryptjs";
import "dotenv/config";
import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
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
import { validate } from "./validate.js";

const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = 3600; // 1 hour in seconds

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

      // Persist user to the database
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          role: "USER",
          plan: "FREE",
          isActive: true,
        },
      });

      // Generate JWT session token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      // Return sanitized output matching the Response DTO
      res.status(201).json(toSignupResponseDto(newUser, token));
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

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      );

      res.status(200).json(toLoginResponseDto(user, token));
    } catch (error) {
      console.error("Error in /login route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default authRouter;
