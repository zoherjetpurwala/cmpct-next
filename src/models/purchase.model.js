import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tier: {
    type: String,
    enum: ["free", "basic", "pro", "enterprise"], // Ensure "free" is included
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date,
    required: function () {
      return this.tier !== "free"; // Make it required only if tier is not free
    },
  },
});

export default mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
