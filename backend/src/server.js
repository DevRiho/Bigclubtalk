import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { assertEnv, env } from "./config/env.js";

async function start() {
  assertEnv();
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`Big Club Talk API running on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
