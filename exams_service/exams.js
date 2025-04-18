import express from "express";
import cors from "cors";

import { router } from "./routes/route.js";
import './redis/redis.js';
import Redis from "./redis/redis.js";
import { createClient } from "redis";

const app = express();
const client = createClient();
export const redis = new Redis(client);

app.use(express.json());
app.use(cors());
app.use("/exams", router);

app.listen(3002,async () => {
  console.log("Server listening on port 3002");
  try {
    // await establishRedis();
  } catch (error) {
    console.log("Error Connecting Redis");
  }
});

(async () => {
  await redis.establishConnection();
  await redis.checkStatus();
})();