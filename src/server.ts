import "dotenv/config";
import { createApp } from "./app";
import { getEnv } from "./utils/env";
import { initMongo } from "./services/mongo";

const env = getEnv();
async function main() {
  await initMongo();
  const app = createApp();
  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

void main();
