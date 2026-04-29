import mongoose from "mongoose";

/**
 * Opens the MongoDB connection for the backend process.
 * @param {string | undefined} uri
 * @returns {Promise<typeof mongoose>}
 */
export function connectDatabase(uri = process.env.MONGO_URI) {
  return mongoose.connect(uri);
}
