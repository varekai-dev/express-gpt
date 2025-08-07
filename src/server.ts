import "dotenv/config";

import { initMongo } from "./services/mongo";
import { getEnv } from "./utils/env";
import { createApp } from "./app";

const env = getEnv();
async function main() {
  await initMongo();
  const app = createApp();
  app.listen(env.port, () => {
     
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

void main();
