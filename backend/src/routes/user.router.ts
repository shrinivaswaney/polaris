import bcrypt from "bcryptjs";
import { Router, type Request, type Response } from "express";
import multer from "multer";
import { prisma } from "../db/db.js";
import { streamUpload } from "../db/storage.js";
import {
  PasswordUpdateSchema,
  UpdateProfileSchema,
  type PasswordUpdateDto,
  type ProfileUpdateDto,
} from "../dto/profile/personal-info-update.dto.js";
import {
  UpdateCurrencySchema,
  UpdateLocaleSchema,
  UpdateThemeSchema,
  type UpdateCurrencyDto,
  type UpdateLocaleDto,
  type UpdateThemeDto,
} from "../dto/profile/settings-update.dto.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";

const userRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // Max file size: 2MB constraint
});

// Get User Profile
userRouter.get(
  "/get-user-profile",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userContext = req.user!;

      const userProfile = await prisma.user.findUnique({
        where: { id: userContext.userId },
        include: {
          preferences: true, // Pulls interests and dietary configurations
        },
      });

      if (!userProfile) {
        res.status(404).json({ error: "User profile not found" });
        return;
      }

      // Stripping out sensitive parameters before shipping payload to mobile UI
      const { passwordHash, ...safeProfileData } = userProfile;
      res.status(200).json({ success: true, data: safeProfileData });
    } catch (error) {
      console.error("Error retrieving profile data", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Update Profile Data
userRouter.patch(
  "/update-user-profile",
  authenticate,
  validate(UpdateProfileSchema),
  async (
    req: Request<{}, {}, ProfileUpdateDto>,
    res: Response,
  ): Promise<void> => {
    try {
      const userContext = req.user!;
      const updatedUser = await prisma.user.update({
        where: { id: userContext.userId },
        data: req.body,
      });
      res.status(200).json({
        success: true,
        message: "Profile data updated",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Profile core data failure:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Update profile photo
userRouter.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userContext = req.user!;

      if (!req.file) {
        res
          .status(400)
          .json({ error: "No image file provided in request context" });
        return;
      }

      const cloudAsset = await streamUpload(req.file.buffer);

      const updatedUser = await prisma.user.update({
        where: { id: userContext.userId },
        data: { avatarUrl: cloudAsset.secure_url },
      });

      res.status(200).json({
        message: "Profile photo uploaded and processed successfully",
        avatarUrl: updatedUser.avatarUrl,
      });
    } catch (error) {
      console.error("Error updating avatar", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Update password
userRouter.patch(
  "/update-user-password",
  authenticate,
  validate(PasswordUpdateSchema),
  async (
    req: Request<{}, {}, PasswordUpdateDto>,
    res: Response,
  ): Promise<void> => {
    try {
      const userContext = req.user!;
      const { oldPassword, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          id: userContext.userId,
        },
      });

      if (!user || !user.passwordHash) {
        res.status(404).json({ error: "User profile not found" });
        return;
      }

      const isOldPassword = await bcrypt.compare(
        oldPassword,
        user.passwordHash,
      );

      if (!isOldPassword) {
        res.status(401).json({ error: "Incorrect Password" });
        return;
      }

      if (oldPassword === newPassword) {
        res.status(400).json({
          error: "New password cannot be identical to the current one",
        });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);

      await prisma.$transaction(
        async (tx: {
          user: {
            update: (arg0: {
              where: { id: any };
              data: { passwordHash: string };
            }) => any;
          };
          refreshToken: {
            updateMany: (arg0: {
              where: { userId: any; revokedAt: null };
              data: { revokedAt: Date };
            }) => any;
          };
        }) => {
          await tx.user.update({
            where: { id: user.id },
            data: { passwordHash: newHashedPassword },
          });

          await tx.refreshToken.updateMany({
            where: { userId: user.id, revokedAt: null },
            data: { revokedAt: new Date() },
          });
        },
      );
      res.status(200).json({
        message: "Password updated successfully. All other devices logged out.",
      });
    } catch (error) {
      console.error("Error updating password", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Update Locale
userRouter.patch(
  "/locale",
  authenticate,
  validate(UpdateLocaleSchema),
  async (
    req: Request<{}, {}, UpdateLocaleDto>,
    res: Response,
  ): Promise<void> => {
    try {
      const userContext = req.user!;
      const { locale } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userContext.userId },
      });

      if (!user || !user.passwordHash) {
        res.status(404).json({ error: "User profile not found" });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { locale: locale },
        select: { id: true, locale: true },
      });

      res.status(200).json({
        success: true,
        message: "Locale updated successfully",
        locale: updatedUser.locale,
      });
    } catch (error) {
      console.error("Locale mutation failure:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// App Theme
userRouter.patch(
  "/theme",
  authenticate,
  validate(UpdateThemeSchema),
  async (
    req: Request<{}, {}, UpdateThemeDto>,
    res: Response,
  ): Promise<void> => {
    try {
      const userContext = req.user!;
      const { theme } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userContext.userId },
      });

      if (!user || !user.passwordHash) {
        res.status(404).json({ error: "User profile not found" });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { appTheme: theme },
        select: { id: true, appTheme: true },
      });

      res.status(200).json({
        success: true,
        message: "Theme updated successfully",
        theme: updatedUser.appTheme,
      });
    } catch (error) {
      console.error("Theme mutation failure:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

userRouter.patch(
  "/currency",
  authenticate,
  validate(UpdateCurrencySchema),
  async (
    req: Request<{}, {}, UpdateCurrencyDto>,
    res: Response,
  ): Promise<void> => {
    try {
      const userContext = req.user!;
      const { currency } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userContext.userId },
      });

      if (!user || !user.passwordHash) {
        res.status(404).json({ error: "User profile not found" });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { currency: currency },
        select: { id: true, currency: true },
      });

      res.status(200).json({
        success: true,
        message: "Currency updated successfully",
        theme: updatedUser.currency,
      });
    } catch (error) {
      console.error("Currency mutation failure:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default userRouter;
