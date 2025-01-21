import express from "express";
import cors from "cors";
import { connectDB } from "./db/connectDb.js";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
dotenv.config();

import router from "./routes/routes.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
});

const app = express();

app.use(limiter);
app.use(express.json());
app.use(cors());
app.use("/auth", router);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Listening on port " + process.env.PORT);
  connectDB();
});
