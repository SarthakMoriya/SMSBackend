import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;



const services = {
  adminService: process.env.ADMIN_SERVICE_URL,
  authService: process.env.AUTH_SERVICE_URL,
  examService: process.env.EXAMS_SERVICE_URL,
  recordsService: process.env.RECORDS_SERVICE_URL,
};

const serviceRoutes = {
  "/admin": services.adminService,
  "/authenticate": services.authService,
  "/exams": services.examService,
  "/records": services.recordsService,
};

// Create proxy middleware for each service
for (const [route, target] of Object.entries(serviceRoutes)) {
    console.log(target)
  app.use(
    route,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { [`^${route}`]: "" },
      onProxyReq: (proxyReq, req, res) => {
        // Add custom headers or modify the request here if needed
      },
      onError: (err, req, res) => {
        console.error("Proxy error:", err);
        res.status(500).send("Something went wrong with the proxy.");
      },
    })
  );
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`API Gateway is running on http://localhost:${PORT}`);
  console.log("Proxying requests to the following services:");
  for (const [route, target] of Object.entries(serviceRoutes)) {
    console.log(`- ${route} -> ${target}`);
  }
});
