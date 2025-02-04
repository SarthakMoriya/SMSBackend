import { createClient } from "redis";

// Create a Redis client
export const client = createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Function to establish the Redis connection
export const establishRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};

// Handle Redis connection errors
client.on("error", (err) => {
  console.error("Redis error:", err);
});
