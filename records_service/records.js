import express from "express";
import cors from "cors";

import { connectDB } from "./db/connectDb.js";
import { router } from "./routes/routes.js";
import "./redis/redis.js";
import Redis from "./redis/redis.js";
import { createClient } from "redis";

const app = express();
const client = createClient();
export const redis = new Redis(client);

app.use(express.json());
app.use(cors());
app.use("/records", router);

app.listen(3001, async () => {
  console.log("Server listening on port 3001");
  await connectDB();
  // await establishRedis()
});

(async () => {
  await redis.establishConnection();
  await redis.checkStatus();
})();
