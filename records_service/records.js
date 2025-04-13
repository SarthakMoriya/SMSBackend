import express from "express";
import cors from "cors";

import { connectDB } from "./db/connectDb.js";
import { router } from "./routes/routes.js";
import { establishRedis } from "./redis/redis.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/records',router)


app.listen(3001, async() => {
  console.log("Server listening on port 3001");
  await connectDB()
  await establishRedis()
});
