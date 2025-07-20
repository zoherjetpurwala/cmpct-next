import { useState } from "react";
import { Star, Zap, Crown, Shield } from "lucide-react";
import { PricingCard } from "@/components/profile-components/PricingCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tierHierarchy = ["free", "basic", "pro", "enterprise"];

const isTierDisabled = (tier, currentTier) => {
  const tierIndex = tierHierarchy.indexOf(tier.toLowerCase());
  const currentTierIndex = tierHierarchy.indexOf(currentTier.toLowerCase());
  return tierIndex <= currentTierIndex;
};

export const PricingSection = ({ user }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const getPlans = (cycle) => {
    const basePlans = [
      {
        title: "Free",
        monthlyPrice: "Free",
        yearlyPrice: "Free",
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
        monthlyPrice: "₹89",
        yearlyPrice: "₹979",
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
        monthlyPrice: "₹289",
        yearlyPrice: "₹3,179",
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
        monthlyPrice: "₹489",
        yearlyPrice: "₹5,379",
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

    return basePlans.map(plan => ({
      ...plan,
      price: cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice,
      billingCycle: cycle
    }));
  };

  const plans = getPlans(billingCycle);

  return (
    <section className="py-5">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-xl p-1 flex">
          <Button
            variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-lg transition-all ${
              billingCycle === 'monthly' 
                ? 'bg-themeColor text-white shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-lg transition-all relative ${
              billingCycle === 'yearly' 
                ? 'bg-themeColor text-white shadow-sm' 
                : 'bg-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
            <Badge 
              variant="secondary" 
              className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5"
            >
              1 Month Free
            </Badge>
          </Button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <PricingCard
            key={`${plan.title}-${billingCycle}`}
            user={user}
            plan={plan}
            highlighted={user.currentTier.toLowerCase() === plan.title.toLowerCase()}
            disabled={isTierDisabled(plan.title, user.currentTier)}
            index={index}
            billingCycle={billingCycle}
          />
        ))}
      </div>

      {/* Yearly Benefits Notice */}
      {billingCycle === 'yearly' && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
          <div className="text-green-700 font-medium mb-1">
            🎉 Yearly Plan Benefits
          </div>
          <div className="text-green-600 text-sm">
            Pay for 11 months and get 1 month absolutely free! Save money with our yearly plans.
          </div>
        </div>
      )}
    </section>
  );
};