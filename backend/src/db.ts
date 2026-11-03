import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set");

const schema = new URL(url).searchParams.get("schema") ?? "public";

const adapter = new PrismaPg({ connectionString: url }, { schema });

export const prisma = new PrismaClient({ adapter });
