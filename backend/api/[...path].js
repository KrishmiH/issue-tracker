const app = require("../src/app");
const connectDB = require("../src/config/db");

let isConnected = false;
let connectionError = null;

module.exports = async (req, res) => {
  try {
    console.log("[Request]", req.method, req.url);
    
    // Skip DB connection for health check
    if (req.url === "/api/health" || req.url === "/health") {
      return res.status(200).json({ ok: true });
    }

    // Connect to MongoDB once (reused across warm invocations)
    if (!isConnected && !connectionError) {
      console.log("[DB] Connecting...");
      try {
        const timeoutId = setTimeout(() => {
          throw new Error("Connection timeout after 15s");
        }, 15000);
        
        await connectDB(process.env.MONGO_URI);
        clearTimeout(timeoutId);
        isConnected = true;
        console.log("[DB] Connected!");
      } catch (dbError) {
        console.error("[DB Error]", dbError.message);
        connectionError = dbError;
        return res.status(503).json({ 
          error: "Database unavailable",
          msg: dbError.message
        });
      }
    }

    // Pass to Express
    return app(req, res);
  } catch (error) {
    console.error("[Error]", error.message);
    return res.status(500).json({ error: error.message });
  }
};
