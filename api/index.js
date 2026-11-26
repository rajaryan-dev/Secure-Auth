import mongoose from 'mongoose';
import { createApp } from '../server/server.js';

let connected = null;

export default async function handler(req, res) {
  if (!process.env.MONGODB_URI) {
    return res.status(503).json({
      success: false,
      message: 'Server configuration error: MONGODB_URI is not set'
    });
  }

  if (mongoose.connection.readyState !== 1) {
    if (!connected) {
      connected = mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 8000
      }).catch((error) => {
        connected = null;
        throw error;
      });
    }
    try {
      await connected;
      connected = null;
    } catch (error) {
      console.error('MongoDB connection failed:', {
        name: error?.name,
        code: error?.code,
        message: error?.message
      });
      return res.status(503).json({
        success: false,
        message: 'Database unavailable. Please try again shortly.'
      });
    }
  }
  return createApp()(req, res);
}
