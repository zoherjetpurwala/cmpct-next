import crypto from "crypto";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import userModel from "@/models/user.model";
import purchaseModel from "@/models/purchase.model";

export async function POST(req) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    plan,
  } = await req.json();

  try {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Payment is valid, update the user's tier and record the purchase
    const expirationDate = calculateExpirationDate(plan);

    // Update user tier
    await userModel.findByIdAndUpdate(userId, {
      currentTier: plan,
      currentTierId: new mongoose.Types.ObjectId(),
    });

    // Record the purchase
    const newPurchase = new purchaseModel({
      userId,
      tier: plan,
      expirationDate,
    });

    await newPurchase.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Error verifying payment" },
      { status: 500 }
    );
  }
}

const calculateExpirationDate = (plan) => {
  const today = new Date();
  return new Date(today.setMonth(today.getMonth() + 1)); // Adds 1 month to current date
};
