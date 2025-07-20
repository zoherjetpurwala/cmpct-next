// api/razorpay/verify/route.js - Updated to match your database schema
import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const calculateExpirationDate = (plan, billingCycle = 'monthly') => {
  const today = new Date();
  const expirationDate = new Date(today);
  
  if (billingCycle === 'yearly') {
    // Add 12 months for yearly plans (11 paid + 1 free)
    expirationDate.setMonth(expirationDate.getMonth() + 12);
  } else {
    // Add 1 month for monthly plans
    expirationDate.setMonth(expirationDate.getMonth() + 1);
  }
  
  return expirationDate;
};

const getAmountForPlan = (plan, billingCycle = 'monthly') => {
  const monthlyPrices = {
    basic: 8900,
    pro: 28900, 
    enterprise: 48900,
  };
  
  const yearlyPrices = {
    basic: 97900,    // 11 months * ₹89
    pro: 317900,     // 11 months * ₹289
    enterprise: 537900, // 11 months * ₹489
  };
  
  if (billingCycle === 'yearly') {
    return yearlyPrices[plan] || 0;
  }
  
  return monthlyPrices[plan] || 0;
};

export async function POST(req) {
  console.log("=== PAYMENT VERIFICATION START ===");
  
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      plan,
      billingCycle = 'monthly'
    } = await req.json();

    console.log("Verification request:", {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      userId,
      plan,
      billingCycle
    });

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !plan) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Missing required payment verification data" },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("Missing Razorpay key secret");
      return NextResponse.json(
        { error: "Payment verification configuration error" },
        { status: 500 }
      );
    }

    // Verify the payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Payment signature verification failed");
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    console.log("Payment signature verified successfully");

    // Calculate expiration date and amount
    const expirationDate = calculateExpirationDate(plan, billingCycle);
    const amount = getAmountForPlan(plan, billingCycle);

    console.log("Payment details:", {
      plan,
      billingCycle,
      amount,
      expirationDate: expirationDate.toISOString()
    });

    // Database operations
    try {
      console.log("Creating purchase record...");
      
      // Create the purchase record with all required fields
      const { data: newPurchase, error: purchaseError } = await supabase
        .from("purchases")
        .insert({
          user_id: userId,
          tier: plan,
          billing_cycle: billingCycle,
          purchase_date: new Date().toISOString(),
          expiration_date: expirationDate.toISOString(),
          razorpay_order_id: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          amount: amount,
          status: 'completed'
        })
        .select()
        .single();

      if (purchaseError) {
        console.error("Error creating purchase record:", purchaseError);
        throw new Error(`Failed to create purchase record: ${purchaseError.message}`);
      }

      console.log("Purchase record created successfully:", newPurchase.id);

      // Update user's current tier and billing cycle
      console.log("Updating user tier...");
      
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({
          current_tier: plan,
          current_tier_id: newPurchase.id,
          billing_cycle: billingCycle,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);

      if (userUpdateError) {
        console.error("Error updating user tier:", userUpdateError);
        
        // Rollback: Delete the purchase record
        console.log("Rolling back purchase record...");
        await supabase
          .from("purchases")
          .delete()
          .eq("id", newPurchase.id);
        
        throw new Error(`Failed to update user tier: ${userUpdateError.message}`);
      }

      console.log("User tier updated successfully");

      // Verify the user update was successful
      const { data: updatedUser, error: verifyError } = await supabase
        .from("users")
        .select("current_tier, billing_cycle, current_tier_id")
        .eq("id", userId)
        .single();

      if (verifyError) {
        console.warn("Could not verify user update:", verifyError);
      } else {
        console.log("User verification:", updatedUser);
      }

      console.log("=== PAYMENT VERIFICATION SUCCESS ===");

      return NextResponse.json({ 
        success: true,
        purchaseId: newPurchase.id,
        tier: plan,
        billingCycle: billingCycle,
        expirationDate: expirationDate.toISOString(),
        message: `${plan} plan activated successfully`
      });

    } catch (dbError) {
      console.error("Database operation failed:", dbError);
      return NextResponse.json(
        { 
          error: "Payment verified but failed to update account",
          details: dbError.message
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("=== PAYMENT VERIFICATION ERROR ===");
    console.error("Error details:", error);
    return NextResponse.json(
      { 
        error: "Payment verification failed",
        details: error.message
      },
      { status: 500 }
    );
  }
}

// Test endpoint to check database schema
export async function GET(req) {
  try {
    // Test the purchases table structure
    const { data, error } = await supabase
      .from("purchases")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Database test error:", error);
      return NextResponse.json({
        error: "Database connection failed",
        details: error.message
      }, { status: 500 });
    }

    // Get table schema info
    const { data: schemaInfo, error: schemaError } = await supabase
      .rpc('get_table_columns', { table_name: 'purchases' })
      .catch(() => ({ data: null, error: "RPC not available" }));

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      sampleData: data,
      schema: schemaInfo
    });

  } catch (error) {
    return NextResponse.json({
      error: "Database test failed",
      details: error.message
    }, { status: 500 });
  }
}