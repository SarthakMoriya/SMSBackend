import express from "express";
import cors from "cors";

import { router } from "./routes/route.js";
import { establishRedis } from "./redis/redis.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/exams", router);

app.listen(3002,async () => {
  console.log("Server listening on port 3002");
  try {
    await establishRedis();
  } catch (error) {
    console.log("Error Connecting Redis");
  }
});
