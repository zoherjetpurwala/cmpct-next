import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String },
  location: { type: String }, // Store geolocation data
  device: { type: String }, // Desktop, Mobile, or Tablet
  os: { type: String }, // Operating system (Windows, iOS, etc.)
  browser: { type: String }, // Browser (Chrome, Safari, etc.)
  referrer: { type: String }, // The referring URL
  screenResolution: { type: String }, // Screen resolution
});

const UrlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  header: { type: String, default: null },
  clickCount: { type: Number, default: 0 },
  visits: [VisitSchema], // An array of visit records
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Url || mongoose.model("Url", UrlSchema);
