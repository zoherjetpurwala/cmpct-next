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
    enum: ["basic", "pro", "enterprise", "free"], // Ensure 'free' is included here
    required: true,
    default: "free", // Default value can still be 'free'
  },
  apiCallsToday: {
    type: Number,
    default: 0,  // Tracks daily API call count
  },
  linkCount: {
    type: Number,
    default: 0,  // Tracks number of URLs created
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
