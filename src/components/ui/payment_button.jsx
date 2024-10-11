"use client";

import { useState } from "react";

const handlePayment = async (userId, plan) => {
  try {
    const response = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, plan }),
    });

    const data = await response.json();
    
    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: "INR",
      name: "cmpct.",
      description: "Plan Subscription",
      order_id: data.id,
      handler: async function (response) {
        const verifyResponse = await fetch("/api/razorpay/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId,
            plan,
          }),
        });

        const result = await verifyResponse.json();

        if (result.success) {
          alert("Payment successful! Your plan has been upgraded.");
        } else {
          alert("Payment verification failed.");
        }
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  } catch (error) {
    console.error("Error processing payment", error);
  }
};

export default function PaymentButton({ userId, plan }) {
  return (
    <button onClick={() => handlePayment(userId, plan)}>
      Buy {plan} Plan
    </button>
  );
}
