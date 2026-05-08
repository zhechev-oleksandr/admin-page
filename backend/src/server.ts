import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/db";

async function main() {
  await prisma.$connect();
  console.log("Connected to DB");
  app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  prisma.$disconnect();
  process.exit(1);
});
