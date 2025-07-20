import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { PricingSection } from "@/components/profile-components/PricingSection";
import { SubscriptionDetailsCard } from "@/components/profile-components/SubscriptionDetailsCard";

export const SubscriptionCard = ({ user, refreshSession }) => (
  <div className="space-y-8">
    {/* Current Subscription Details */}
    <SubscriptionDetailsCard user={user} refreshSession={refreshSession} />
    
    {/* Pricing Plans */}
    <Card 
      id="subscription-plans"
      className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg"
    >
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
        <PricingSection user={user} />
      </CardContent>
    </Card>
  </div>
);