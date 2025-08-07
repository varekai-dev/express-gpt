"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const env_1 = require("./utils/env");
const mongo_1 = require("./services/mongo");
const env = (0, env_1.getEnv)();
async function main() {
    await (0, mongo_1.initMongo)();
    const app = (0, app_1.createApp)();
    app.listen(env.port, () => {
        // eslint-disable-next-line no-console
        console.log(`API listening on http://localhost:${env.port}`);
    });
}
void main();
