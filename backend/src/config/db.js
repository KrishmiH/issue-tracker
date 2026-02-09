const mongoose = require("mongoose");

let cached = global.__mongooseCache;
if (!cached) cached = global.__mongooseCache = { conn: null, promise: null };

async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  // await mongoose.connect(uri);
  // console.log("MongoDB connected");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m);
  }

  cached.conn = await cached.promise;
  console.log("MongoDB connected");
  return cached.conn;
}

module.exports = connectDB;
