import mongoose from "mongoose";

/**
 * Opens the MongoDB connection for the backend process.
 * @param {string | undefined} uri
 * @returns {Promise<typeof mongoose>}
 */
export function connectDatabase(uri = process.env.MONGO_URI) {
  if (!uri) {
    throw new Error("MONGO_URI is missing. Add it in Render > Environment before deploying.");
  }

  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 10000),
  });
}
