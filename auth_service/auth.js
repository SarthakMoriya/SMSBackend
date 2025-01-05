import express from "express";
import cors from "cors";
import { connectDB } from "./db/connectDb.js";
import dotenv from "dotenv";
dotenv.config();

import router from "./routes/routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use('/auth',router)


app.listen(process.env.PORT || 3000, () => {
  console.log("Server Listening on port " + process.env.PORT);
  connectDB()
});
