import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    const expirationDate = calculateExpirationDate(plan);

    // Update user tier
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        current_tier: plan
      })
      .eq("id", userId);

    if (userUpdateError) {
      throw new Error(userUpdateError.message);
    }

    // Create new purchase record
    const { data: newPurchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        user_id: userId,
        tier: plan,
        purchase_date: new Date().toISOString(),
        expiration_date: expirationDate.toISOString()
      })
      .select()
      .single();

    if (purchaseError) {
      throw new Error(purchaseError.message);
    }

    // Update user's current tier ID
    const { error: tierUpdateError } = await supabase
      .from("users")
      .update({ current_tier_id: newPurchase.id })
      .eq("id", userId);

    if (tierUpdateError) {
      throw new Error(tierUpdateError.message);
    }

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
  return new Date(today.setMonth(today.getMonth() + 1));
};