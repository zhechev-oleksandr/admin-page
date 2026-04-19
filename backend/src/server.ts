import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/db";

async function main() {
  await prisma.$connect();
  console.log("Connected to MongoDB");

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});