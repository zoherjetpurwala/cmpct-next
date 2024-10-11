import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const getAmountForPlan = (plan) => {
  const planPrices = {
    basic: 5000, // in paise (₹50)
    pro: 10000, // in paise (₹100)
    enterprise: 20000, // in paise (₹200)
  };
  return planPrices[plan];
};

export async function POST(req) {
  const { userId, plan } = await req.json();

  if (!userId || !plan) {
    return NextResponse.json({ error: "Missing userId or plan" }, { status: 400 });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = getAmountForPlan(plan);
    
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${userId}`,
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: "Error creating order" }, { status: 500 });
  }
}
