"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import PaymentButton from "./ui/payment_button";

export default function ProfileComponent() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Use NextAuth session
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user) return null;

  const tierColors = {
    free: "bg-gray-500",
    basic: "bg-blue-500",
    pro: "bg-purple-500",
    enterprise: "bg-gold-500",
  };

  return (
    <div>
      <Card className="rounded-2xl border border-blue-800/25 mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">User Information</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </div>
            <p className="text-sm text-gray-500 flex gap-2 items-center justify-center">
              Account Tier:
              <Badge
                className={`${
                  tierColors[session?.user.currentTier]
                } text-white px-5 py-1`}
              >
                {session?.user.currentTier.charAt(0).toUpperCase() +
                  session?.user.currentTier.slice(1)}
              </Badge>
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue={session?.user.name} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={session?.user.email}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue={session?.user.phone}
                />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">
              API Calls Today: {session?.user.apiCallsToday}
            </p>
            <p className="text-sm text-gray-500">
              Total Links Created: {session?.user.linkCount}
            </p>
          </div>
          <Button type="submit" className="bg-blue-950" disabled>
            Update Profile
          </Button>
        </CardFooter>
      </Card>

      <Card className="rounded-2xl border border-blue-800/25">
        <CardHeader>
          <div className="flex items-center">
            <div>
              <CardTitle className="text-2xl">Plans</CardTitle>
              <CardDescription>
                View your plan details or upgrade from your current plan.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <PricingSection user={session.user} />
        </CardContent>
      </Card>
    </div>
  );
}

const tierHierarchy = ["free", "basic", "pro", "enterprise"];

const isTierDisabled = (tier, currentTier) => {
  const tierIndex = tierHierarchy.indexOf(tier.toLowerCase());
  const currentTierIndex = tierHierarchy.indexOf(currentTier.toLowerCase());
  return tierIndex <= currentTierIndex; // Disable if the tier is current or below
};

const PricingSection = ({ user }) => (
  <section className="py-5">
    <div className="grid md:grid-cols-4 gap-8">
      <PricingCard
        user={user}
        title="Free"
        price="Free"
        features={[
          "Up to 1,000 short links",
          "Basic analytics",
          "Standard support",
        ]}
        highlighted={user.currentTier.toLowerCase() === "free"}
        disabled={isTierDisabled("free", user.currentTier)}
      />
      <PricingCard
        user={user}
        title="Basic"
        price="₹89"
        features={[
          "Up to 500 short links",
          "Unlimited API Calls",
          "Basic analytics",
        ]}
        highlighted={user.currentTier.toLowerCase() === "basic"}
        disabled={isTierDisabled("basic", user.currentTier)}
      />
      <PricingCard
        user={user}
        title="Pro"
        price="₹289"
        features={[
          "Up to 10,000 short links",
          "Unlimited API Calls",
          "Advanced analytics",
          "Additional API access",
        ]}
        highlighted={user.currentTier.toLowerCase() === "pro"}
        disabled={isTierDisabled("pro", user.currentTier)}
      />
      <PricingCard
        user={user}
        title="Enterprise"
        price="₹489"
        features={[
          "Unlimited short links",
          "Unlimited API Calls",
          "Advanced analytics",
          "Additional API access",
        ]}
        highlighted={user.currentTier.toLowerCase() === "enterprise"}
        disabled={isTierDisabled("enterprise", user.currentTier)}
      />
    </div>
  </section>
);
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

const PricingCard = ({
  user,
  title,
  price,
  features,
  highlighted = false,
  disabled = false,
}) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-sm ${
      highlighted ? "ring-2 ring-blue-900/50" : ""
    }`}
  >
    <h4 className="text-xl font-semibold mb-2">{title}</h4>
    <p className="text-3xl font-bold mb-4">{price}</p>
    <ul className="space-y-2 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <Check className="w-5 h-5 text-green-500 mr-2" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    {!highlighted && (
      <Button
        onClick={() => handlePayment(user.id, title.toLowerCase())}
        className={`w-full ${!disabled ? "bg-blue-900" : ""} ${
          highlighted ? "bg-blue-900" : ""
        }`}
        disabled={disabled}
      >
        {highlighted ? "Current Plan" : "Upgrade Now"}
      </Button>
    )}
  </div>
);
