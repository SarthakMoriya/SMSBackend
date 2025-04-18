class Redis {
  constructor(client) {
    this.client = client;
  }

  /**
   * Establishes a connection to Redis with retries and exponential backoff.
   * @param {number} retries Number of retry attempts (default: 5)
   * @param {number} delay Initial delay in milliseconds (default: 1000)
   */
  async establishConnection(retries = 5, delay = 1000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.client.connect();
        console.log("✅ Connected to Redis");
        return;
      } catch (error) {
        console.error(
          `❌ Redis connection failed (Attempt ${attempt}):`,
          error
        );

        if (attempt < retries) {
          const waitTime = delay * Math.pow(2, attempt - 1);
          console.log(`🔁 Retrying in ${waitTime / 1000}s...`);
          await new Promise((res) => setTimeout(res, waitTime));
        } else {
          console.error("🚨 All Redis connection attempts failed.");
        }
      }
    }
  }

  /**
   * Checks the status of Redis using the PING command.
   * @returns {Promise<string|null>} Redis status or null if failed
   */
  async checkStatus() {
    try {
      const result = await this.client.ping();
      console.log("✅ Redis status:", result);
      return result;
    } catch (error) {
      console.error("⚠️ Failed to check Redis status:", error);
      return null;
    }
  }
}

export default Redis;
