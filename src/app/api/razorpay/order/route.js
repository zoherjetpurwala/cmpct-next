import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

const getAmountForPlan = (plan, billingCycle = 'monthly') => {
  const monthlyPrices = {
    basic: 8900,     // ₹89
    pro: 28900,      // ₹289
    enterprise: 48900, // ₹489
  };
  
  const yearlyPrices = {
    basic: 97900,    // ₹979 (11 months * ₹89)
    pro: 317900,     // ₹3179 (11 months * ₹289)
    enterprise: 537900, // ₹5379 (11 months * ₹489)
  };
  
  if (billingCycle === 'yearly') {
    return yearlyPrices[plan] || 0;
  }
  
  return monthlyPrices[plan] || 0;
};

const generateReceiptId = (userId, plan, billingCycle) => {
  const userHash = crypto.createHash('md5').update(userId.toString()).digest('hex').substring(0, 6);
  const timestamp = Date.now().toString(36);
  const cycle = billingCycle === 'yearly' ? 'y' : 'm';
  return `rcpt_${cycle}_${plan}_${userHash}_${timestamp}`.substring(0, 40);
};

export async function POST(req) {
  try {
    const { userId, plan, billingCycle = 'monthly' } = await req.json();

    console.log("=== RAZORPAY ORDER CREATION DEBUG ===");
    console.log("Request data:", { userId, plan, billingCycle });

    // Validate input
    if (!userId || !plan) {
      console.error("Missing required fields:", { userId: !!userId, plan: !!plan });
      return NextResponse.json(
        { error: "Missing userId or plan" }, 
        { status: 400 }
      );
    }

    if (!['monthly', 'yearly'].includes(billingCycle)) {
      console.error("Invalid billing cycle:", billingCycle);
      return NextResponse.json(
        { error: "Invalid billing cycle" }, 
        { status: 400 }
      );
    }

    // Check environment variables
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    console.log("Environment check:", {
      keyId: keyId ? `${keyId.substring(0, 8)}...` : "MISSING",
      keySecret: keySecret ? `${keySecret.substring(0, 8)}...` : "MISSING",
      nodeEnv: process.env.NODE_ENV
    });

    if (!keyId || !keySecret) {
      console.error("Missing Razorpay credentials");
      return NextResponse.json(
        { 
          error: "Payment service configuration error",
          details: "Missing API credentials"
        }, 
        { status: 500 }
      );
    }

    // Validate plan and get amount
    const amount = getAmountForPlan(plan, billingCycle);
    if (amount === 0) {
      console.error("Invalid plan or amount:", { plan, billingCycle, amount });
      return NextResponse.json(
        { error: "Invalid plan selected" }, 
        { status: 400 }
      );
    }

    console.log("Amount calculated:", { plan, billingCycle, amount });

    // Initialize Razorpay with explicit error handling
    let razorpay;
    try {
      razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      console.log("Razorpay instance created successfully");
    } catch (initError) {
      console.error("Failed to initialize Razorpay:", initError);
      return NextResponse.json(
        { 
          error: "Payment service initialization failed",
          details: initError.message
        }, 
        { status: 500 }
      );
    }

    // Generate receipt ID
    const receiptId = generateReceiptId(userId, plan, billingCycle);
    console.log("Generated receipt ID:", receiptId);
    
    const options = {
      amount: amount,
      currency: "INR",
      receipt: receiptId,
      notes: {
        userId: userId.toString(),
        plan: plan,
        billingCycle: billingCycle,
        timestamp: new Date().toISOString()
      }
    };

    console.log("Order options:", {
      ...options,
      notes: { ...options.notes, userId: "[REDACTED]" }
    });

    // Create order with explicit error handling
    let order;
    try {
      order = await razorpay.orders.create(options);
      console.log("Order created successfully:", {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status
      });
    } catch (orderError) {
      console.error("Failed to create Razorpay order:", orderError);
      return NextResponse.json(
        { 
          error: "Failed to create payment order",
          details: orderError.message || "Unknown error"
        }, 
        { status: 500 }
      );
    }
        
    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      billingCycle: billingCycle
    });

  } catch (error) {
    console.error("=== RAZORPAY ORDER ERROR ===");
    console.error("Error details:", {
      message: error.message,
      statusCode: error.statusCode,
      error: error.error,
      stack: error.stack
    });
    
    const errorMessage = error.error?.description || error.message || "Error creating order";
    
    return NextResponse.json(
      { 
        error: "Payment initialization failed",
        details: errorMessage
      }, 
      { status: 500 }
    );
  }
}