"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Crown, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";

// Check if Razorpay is loaded
const isRazorpayLoaded = () => {
  return typeof window !== 'undefined' && window.Razorpay;
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (isRazorpayLoaded()) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handlePayment = async (userId, plan, billingCycle = 'monthly', onSuccess) => {
  try {
    console.log("=== PAYMENT INITIALIZATION ===");
    console.log("Payment params:", { userId, plan, billingCycle });

    // Load Razorpay script if not already loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error("Failed to load payment gateway");
    }

    // Create order
    console.log("Creating payment order...");
    const response = await fetch("/api/razorpay/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, plan, billingCycle }),
    });

    console.log("Order response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Order creation failed:", errorData);
      throw new Error(errorData.details || errorData.error || "Failed to create order");
    }

    const data = await response.json();
    console.log("Order created:", { orderId: data.id, amount: data.amount });

    // Check if we have the public key
    const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!publicKey) {
      console.error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID");
      throw new Error("Payment configuration error");
    }

    console.log("Using public key:", publicKey.substring(0, 8) + "...");
    
    const options = {
      key: publicKey,
      amount: data.amount,
      currency: "INR",
      name: "cmpct.",
      description: `${plan} Plan - ${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} Subscription`,
      order_id: data.id,
      handler: async function (response) {
        console.log("=== PAYMENT SUCCESS ===");
        console.log("Payment response:", {
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id
        });

        try {
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
              billingCycle,
            }),
          });

          const result = await verifyResponse.json();
          console.log("Verification result:", result);

          if (result.success) {
            toast.success(`Payment successful! Your ${billingCycle} plan has been activated.`, {
              icon: <CheckCircle2 className="h-4 w-4" />,
            });
            
            // Call the success callback to refresh session
            if (onSuccess) {
              await onSuccess();
            }
            
          } else {
            throw new Error(result.details || "Payment verification failed");
          }
        } catch (verifyError) {
          console.error("Verification error:", verifyError);
          toast.error(`Payment verification failed: ${verifyError.message}`, {
            icon: <AlertCircle className="h-4 w-4" />,
          });
        }
      },
      prefill: {
        name: "Customer",
        email: "customer@example.com",
      },
      theme: {
        color: "#eb6753",
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal dismissed");
        }
      }
    };

    console.log("Opening Razorpay checkout with options:", {
      ...options,
      handler: "[FUNCTION]"
    });

    if (!window.Razorpay) {
      throw new Error("Razorpay not loaded properly");
    }

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();

  } catch (error) {
    console.error("=== PAYMENT ERROR ===");
    console.error("Error details:", error);
    toast.error(`Payment failed: ${error.message}`, {
      icon: <AlertCircle className="h-4 w-4" />,
    });
  }
};

export default function PaymentButton({ 
  userId, 
  plan, 
  billingCycle = 'monthly',
  disabled = false, 
  highlighted = false,
  className = "",
  children,
  variant = "default"
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const { update } = useSession();

  useEffect(() => {
    // Check if Razorpay is available and load it if needed
    loadRazorpayScript().then(setRazorpayLoaded);
  }, []);

  const handleClick = async () => {
    if (!razorpayLoaded) {
      toast.error("Payment gateway is loading, please try again", {
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    setIsProcessing(true);
    try {
      await handlePayment(userId, plan, billingCycle, async () => {
        // Success callback - refresh the session
        console.log("Refreshing session after successful payment...");
        await update();
        console.log("Session refreshed successfully");
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <Button
        onClick={handleClick}
        disabled={disabled || isProcessing || !razorpayLoaded}
        className={`w-full font-medium transition-all duration-300 ${className} ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            : highlighted
            ? "bg-gradient-to-r from-themeColor to-themeColor-dark hover:from-themeColor-dark hover:to-themeColor-text text-white shadow-lg shadow-themeColor/25 border border-themeColor/20"
            : "bg-themeColor hover:bg-themeColor-dark text-white shadow-lg shadow-themeColor/25 hover:scale-105 border border-themeColor/20"
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Processing Payment...
          </div>
        ) : !razorpayLoaded ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Loading...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            {highlighted ? (
              <Crown className="w-4 h-4 mr-2" />
            ) : (
              <CreditCard className="w-4 h-4 mr-2" />
            )}
            {children || `Upgrade to ${plan}`}
          </div>
        )}
      </Button>
    </motion.div>
  );
}