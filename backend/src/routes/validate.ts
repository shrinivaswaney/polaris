import { type NextFunction, type Request, type Response } from "express";
import { ZodError, type ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Validates req.body, req.query, or req.params depending on schema definition
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formats errors into a clean, developer-friendly array
        const formattedErrors = error.issues.map((err) => ({
          field: err.path.slice(1).join("."), // removes 'body.' or 'query.' prefix
          message: err.message,
        }));

        res
          .status(400)
          .json({ error: "Validation failed", details: formattedErrors });
        return;
      }
      res.status(500).json({ error: "Internal validation framework error" });
    }
  };
};
