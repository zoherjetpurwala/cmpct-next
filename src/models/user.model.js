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
  accessToken: {
    type: String,
    required: true,
    unique: true,
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
