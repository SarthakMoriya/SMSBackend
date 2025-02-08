import express from "express";
import cors from "cors";

import { router } from "./routes/routes.js";
import './redis/redis.js';
import { establishRedis } from "./redis/redis.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/admin',router)


app.listen(3003, () => {
  console.log("Server listening on port 3003");
  establishRedis()
});
