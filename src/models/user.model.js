import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
  currentTier: {
    type: String,
    enum: ["basic", "pro", "enterprise", "free"],
    required: true,
    default: "free",
  },
  apiCallsToday: {
    type: Number,
    default: 0,
  },
  apiCallResetTime: {
    type: Date, // To track when the API calls were last reset
    default: Date.now,
  },
  linkCount: {
    type: Number,
    default: 0,
  },
  linksThisMonth: {
    type: Number,
    default: 0, // Tracks the number of links created in the current month
  },
  linkLimitResetDate: {
    type: Date, // To track when the link count resets each month
    default: Date.now,
  },
  currentTierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Purchase",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);