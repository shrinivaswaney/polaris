import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing from your .env file");
}

const ai = new GoogleGenAI({ apiKey });

const MODELS = ["gemini-3.8-flash", "gemini-3.5-flash-lite"] as const;

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

// --------------------------------------------------
// Utilities
// --------------------------------------------------

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface GeminiError {
  status?: number;
  statusCode?: number;
  message?: string;
}

const getErrorDetails = (error: unknown) => {
  const err = error as GeminiError;

  return {
    status: err.status ?? err.statusCode,
    message: err.message ?? String(error),
  };
};

// --------------------------------------------------
// Gemini Text Generation
// --------------------------------------------------

async function generateText(prompt: string): Promise<string> {
  for (const model of MODELS) {
    console.log(`\nAttempting generation with ${model}...`);

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        const generatedText = response.text;

        if (!generatedText?.trim()) {
          throw new Error(`Empty response received from ${model}`);
        }

        console.log(`\nSuccess using ${model}!\n`);

        return generatedText;
      } catch (error: unknown) {
        const { status, message } = getErrorDetails(error);

        console.error(
          `Model: ${model} | Attempt: ${attempt}/${MAX_RETRIES} | Status: ${status ?? "Unknown"}`,
          message,
        );

        // Model unavailable or not found.
        if (status === 404) {
          console.warn(`${model} not found. Switching to fallback...`);
          break;
        }

        // Retry temporary service or rate-limit errors.
        if (status === 503 || status === 429) {
          if (attempt < MAX_RETRIES) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1);

            console.warn(`Retrying in ${delay}ms...`);

            await sleep(delay);
            continue;
          }

          console.warn(`${model} unavailable. Trying fallback...`);
          break;
        }

        // Do not retry authentication, permission, or request errors.
        throw error;
      }
    }
  }

  throw new Error("All configured Gemini models failed.");
}

// --------------------------------------------------
// Test Execution
// --------------------------------------------------

async function main() {
  try {
    const prompt =
      "Explain the difference between synchronous and asynchronous code in Node.js";

    const result = await generateText(prompt);

    console.log("\n========== GENERATED RESPONSE ==========\n");
    console.log(result);
    console.log("\n========================================\n");
  } catch (error: unknown) {
    console.error("\nGemini generation failed:", error);
    process.exitCode = 1;
  }
}

main();
