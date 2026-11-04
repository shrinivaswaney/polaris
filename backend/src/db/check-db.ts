import { prisma } from "./db.js";

async function main() {
  const [info] = await prisma.$queryRaw<{ db: string; schema: string }[]>`
    SELECT current_database() AS db, current_schema() AS schema
  `;
  console.log("Connected:", info);

  console.log("Users:", await prisma.user.count());
  console.log("Trips:", await prisma.trip.count());
}

main()
  .catch((e) => {
    console.error("Check failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
