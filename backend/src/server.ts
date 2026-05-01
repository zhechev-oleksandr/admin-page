import app from "./app";
import { env } from "./config/env";

async function main() {

  app.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
