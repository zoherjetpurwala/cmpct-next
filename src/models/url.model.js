import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // URL is now linked to a user
  },
  header: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Url || mongoose.model("Url", UrlSchema);
