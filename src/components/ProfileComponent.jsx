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
import { 
  Check, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Calendar,
  BarChart2,
  Link as LinkIcon,
  Crown,
  Shield,
  Zap,
  Star,
  Edit3,
  Save,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import PaymentButton from "./ui/payment_button";
import LoadingSpinner from "./ui/loading-spinner";

export default function ProfileComponent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  }, [status, router, session]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session?.user) return null;

  const tierColors = {
    free: "bg-gray-500",
    basic: "bg-themeColor",
    pro: "bg-gradient-to-r from-themeColor to-themeColor-dark",
    enterprise: "bg-gradient-to-r from-themeColor-dark to-themeColor-text",
  };

  const tierIcons = {
    free: Star,
    basic: Zap,
    pro: Crown,
    enterprise: Shield
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const TierIcon = tierIcons[session?.user.currentTier] || Star;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* User Information Card */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-themeColor to-themeColor-dark rounded-2xl flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-themeColor-text">User Profile</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your account information and settings
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">Account Tier</p>
                <Badge className={`${tierColors[session?.user.currentTier]} text-white px-4 py-2 text-sm font-medium`}>
                  <TierIcon className="w-4 h-4 mr-2" />
                  {session?.user.currentTier?.charAt(0).toUpperCase() + session?.user.currentTier?.slice(1)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-themeColor-text font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-themeColor-text font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-themeColor-text font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="memberSince" className="text-themeColor-text font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </Label>
                  <Input
                    id="memberSince"
                    value={new Date(session?.user.createdAt || Date.now()).toLocaleDateString()}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200"
                >
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-themeColor-text font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Enter new password"
                      className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-themeColor-text font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                      className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-3 bg-themeColor-light/20 rounded-xl">
                <BarChart2 className="w-5 h-5 text-themeColor" />
                <div>
                  <div className="text-sm text-gray-600">API Calls Today</div>
                  <div className="font-semibold text-themeColor-text">{session?.user.apiCallsToday || 0}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-themeColor-light/20 rounded-xl">
                <LinkIcon className="w-5 h-5 text-themeColor" />
                <div>
                  <div className="text-sm text-gray-600">Total Links</div>
                  <div className="font-semibold text-themeColor-text">{session?.user.linkCount || 0}</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-themeColor hover:bg-themeColor-dark text-white"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: session.user.name || "",
                        email: session.user.email || "",
                        phone: session.user.phone || "",
                        newPassword: "",
                        confirmPassword: ""
                      });
                    }}
                    className="border-gray-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="bg-themeColor hover:bg-themeColor-dark text-white"
                  >
                    {isUpdating ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Updating...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Subscription Plans Card */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-themeColor/10 rounded-xl">
                <Crown className="h-6 w-6 text-themeColor" />
              </div>
              <div>
                <CardTitle className="text-2xl text-themeColor-text">Subscription Plans</CardTitle>
                <CardDescription className="text-gray-600">
                  Upgrade your plan to unlock more features and higher limits
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <PricingSection user={session.user} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

const tierHierarchy = ["free", "basic", "pro", "enterprise"];

const isTierDisabled = (tier, currentTier) => {
  const tierIndex = tierHierarchy.indexOf(tier.toLowerCase());
  const currentTierIndex = tierHierarchy.indexOf(currentTier.toLowerCase());
  return tierIndex <= currentTierIndex;
};

const PricingSection = ({ user }) => {
  const plans = [
    {
      title: "Free",
      price: "Free",
      icon: Star,
      features: [
        "Up to 1,000 short links",
        "Basic analytics",
        "Standard support",
      ],
      color: "gray"
    },
    {
      title: "Basic",
      price: "₹89",
      icon: Zap,
      features: [
        "Up to 10,000 short links",
        "Unlimited API Calls",
        "Advanced analytics",
      ],
      color: "themeColor"
    },
    {
      title: "Pro",
      price: "₹289",
      icon: Crown,
      features: [
        "Up to 100,000 short links",
        "Unlimited API Calls",
        "Advanced analytics",
        "Team collaboration",
      ],
      color: "themeColor",
      popular: true
    },
    {
      title: "Enterprise",
      price: "₹489",
      icon: Shield,
      features: [
        "Unlimited short links",
        "Unlimited API Calls",
        "Advanced analytics",
        "Priority support",
      ],
      color: "themeColor"
    }
  ];

  return (
    <section className="py-5">
      <div className="grid md:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <PricingCard
            key={plan.title}
            user={user}
            plan={plan}
            highlighted={user.currentTier.toLowerCase() === plan.title.toLowerCase()}
            disabled={isTierDisabled(plan.title, user.currentTier)}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

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
          toast.success("Payment successful! Your plan has been upgraded.");
        } else {
          toast.error("Payment verification failed.");
        }
      },
      theme: {
        color: "#eb6753",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  } catch (error) {
    console.error("Error processing payment", error);
    toast.error("Payment processing failed");
  }
};

const PricingCard = ({
  user,
  plan,
  highlighted = false,
  disabled = false,
  index
}) => {
  const Icon = plan.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: highlighted ? 0 : -4 }}
      className={`relative bg-white rounded-2xl border transition-all duration-300 ${
        highlighted 
          ? "border-themeColor shadow-xl shadow-themeColor/20 ring-1 ring-themeColor/20" 
          : "border-gray-200/60 shadow-lg hover:shadow-xl hover:border-themeColor/30"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-themeColor to-themeColor-dark text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
            Most Popular
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
            highlighted ? "bg-themeColor text-white" : "bg-themeColor/10 text-themeColor"
          }`}>
            <Icon className="h-6 w-6" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.title}</h4>
          <div className="text-3xl font-bold text-themeColor">{plan.price}</div>
          {plan.price !== "Free" && (
            <div className="text-sm text-gray-500">per month</div>
          )}
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm">
              <Check className={`w-4 h-4 mr-3 flex-shrink-0 ${
                highlighted ? "text-themeColor" : "text-green-500"
              }`} />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {highlighted ? (
          <div className="w-full py-3 text-center bg-themeColor/10 text-themeColor font-medium rounded-xl border border-themeColor/20">
            Current Plan
          </div>
        ) : (
          <Button
            onClick={() => handlePayment(user.id, plan.title.toLowerCase())}
            disabled={disabled}
            className={`w-full font-medium transition-all duration-300 ${
              disabled
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-themeColor hover:bg-themeColor-dark text-white shadow-lg shadow-themeColor/25 hover:scale-105"
            }`}
          >
            {disabled ? "Current or Lower Tier" : "Upgrade Now"}
          </Button>
        )}
      </div>
    </motion.div>
  );
};