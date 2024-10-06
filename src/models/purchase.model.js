import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tier: {
    type: String,
    enum: ['basic', 'pro', 'enterprise'],
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  expirationDate: {
    type: Date, // If applicable for subscription
  },
});

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
