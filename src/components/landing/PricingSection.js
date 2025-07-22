import { Check, Sparkles, Zap, Shield, Crown, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getPlans = (cycle) => {
    return [
      {
        title: "Free",
        monthlyPrice: "Free",
        yearlyPrice: "Free",
        icon: <Star className="w-5 h-5" />,
        features: [
          "Up to 1,000 short links",
          "Basic analytics",
          "Standard support"
        ],
        color: "gray",
        ctaText: "Get Started"
      },
      {
        title: "Basic",
        monthlyPrice: "₹89",
        yearlyPrice: "₹979",
        icon: <Zap className="w-5 h-5" />,
        features: [
          "Up to 10,000 short links",
          "Unlimited API Calls",
          "Advanced analytics"
        ],
        color: "themeColor",
        ctaText: "Coming Soon"
      },
      {
        title: "Pro",
        monthlyPrice: "₹289",
        yearlyPrice: "₹3,179",
        icon: <Crown className="w-5 h-5" />,
        features: [
          "Up to 100,000 short links",
          "Unlimited API Calls",
          "Advanced analytics",
          "Team collaboration"
        ],
        color: "themeColor",
        popular: true,
        ctaText: "Start Free Trial"
      },
      {
        title: "Enterprise",
        monthlyPrice: "₹489",
        yearlyPrice: "₹5,379",
        icon: <Shield className="w-5 h-5" />,
        features: [
          "Unlimited short links",
          "Unlimited API Calls",
          "Advanced analytics",
          "Priority support"
        ],
        color: "themeColor",
        enterprise: true,
        ctaText: "Contact Sales"
      }
    ];
  };

  const plans = getPlans(billingCycle).map(plan => ({
    ...plan,
    price: billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice,
  }));

  return (
    <section className="py-32 bg-gradient-to-b from-white via-themeColor-light/10 to-themeColor-light/30 border-b-2 border-themeColor-border rounded-b-3xl relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-themeColor/5 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-themeColor/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-themeColor/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-themeColor-light/50 text-themeColor-text text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Flexible Plans</span>
          </div>
          <h3 className="font-bold mb-4 relative z-10 text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b to-[90%] from-themeColor to-themeColor-dark text-center font-sans">
            Simple, Transparent Pricing
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            Choose the perfect plan for your needs. Start free and scale as you grow.
          </p>
          
          {/* Billing Toggle - Updated to match the second design */}
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
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 max-w-7xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div key={`${plan.title}-${billingCycle}`} variants={cardVariants}>
              <PricingCard
                {...plan}
                highlighted={plan.popular}
                billingCycle={billingCycle}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Yearly Benefits Notice */}
        {billingCycle === 'yearly' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 p-4 bg-green-50 border border-green-200 rounded-xl text-center max-w-2xl mx-auto"
          >
            <div className="text-green-700 font-medium mb-1">
              🎉 Yearly Plan Benefits
            </div>
            <div className="text-green-600 text-sm">
              Pay for 11 months and get 1 month absolutely free! Save money with our yearly plans.
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const PricingCard = ({ 
  icon, 
  title, 
  price,
  monthlyPrice,
  yearlyPrice,
  features, 
  highlighted = false, 
  enterprise = false,
  ctaText = "Get Started",
  popular,
  billingCycle
}) => {
  const getYearlySavings = () => {
    if (billingCycle !== 'yearly' || !monthlyPrice || !yearlyPrice) return null;
    
    const monthly = parseFloat(monthlyPrice.replace('₹', '').replace(',', ''));
    const yearly = parseFloat(yearlyPrice.replace('₹', '').replace(',', ''));
    
    if (isNaN(monthly) || isNaN(yearly)) return null;
    
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - yearly;
    
    return savings > 0 ? `₹${savings.toLocaleString()}` : null;
  };

  const isDisabled = title === "Basic" || (title === "Free" && ctaText === "Get Started");

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative bg-white rounded-2xl border transition-all duration-300 group h-full flex flex-col ${
        highlighted 
          ? "border-themeColor shadow-xl shadow-themeColor/20 ring-1 ring-themeColor/20" 
          : "border-gray-200/60 shadow-lg hover:shadow-xl hover:border-themeColor/30"
      } ${enterprise ? "bg-gradient-to-br from-white to-themeColor-light/20" : ""}`}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-themeColor to-themeColor-dark text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
            Most Popular
          </div>
        </div>
      )}

      <div className="p-8 flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
            highlighted ? "bg-themeColor text-white" : "bg-themeColor/10 text-themeColor"
          }`}>
            {icon}
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
        </div>

        {/* Pricing */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center">
            <span className={`text-4xl font-bold ${
              highlighted ? "text-themeColor" : "text-gray-900"
            }`}>
              {price}
            </span>
            {price !== "Free" && (
              <span className="text-gray-500 text-sm ml-2">
                /{billingCycle === 'yearly' ? 'year' : 'month'}
              </span>
            )}
          </div>
          {billingCycle === 'yearly' && getYearlySavings() && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              Save {getYearlySavings()} per year
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className={`w-5 h-5 mr-3 ${
                highlighted ? "text-themeColor" : "text-green-500"
              }`} />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          className={`w-full font-medium transition-all duration-300 group-hover:scale-105 mt-auto ${
            highlighted 
              ? "bg-themeColor hover:bg-themeColor-dark text-white shadow-lg shadow-themeColor/25" 
              : enterprise
              ? "bg-gradient-to-r from-themeColor-text to-themeColor-dark text-white hover:shadow-lg"
              : "border-themeColor/30 text-themeColor hover:bg-themeColor hover:text-white"
          }`}
          variant={highlighted || enterprise ? "default" : "outline"}
          disabled={isDisabled}
        >
          {isDisabled ? "Coming Soon" : (
            <>
              {ctaText}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default PricingSection;