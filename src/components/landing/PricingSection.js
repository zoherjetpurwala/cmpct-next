import { Check, Sparkles, Zap, Shield, Crown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

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
          
          {/* Pricing toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 border border-themeColor/20 shadow-sm">
            <button 
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                !isYearly 
                  ? "text-white bg-themeColor shadow-sm" 
                  : "text-gray-600 hover:text-themeColor"
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                isYearly 
                  ? "text-white bg-themeColor shadow-sm" 
                  : "text-gray-600 hover:text-themeColor"
              }`}
            >
              Yearly
              <span className="ml-1 text-xs bg-themeColor text-white px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 max-w-7xl mx-auto"
        >
          <motion.div variants={cardVariants}>
            <PricingCard
              icon={<Sparkles className="w-5 h-5" />}
              title="Free"
              price="Free"
              period=""
              description="Perfect for getting started"
              features={[
                "Up to 1,000 short links",
                "Basic analytics",
                "Standard support"
              ]}
              ctaText="Get Started"
              isYearly={isYearly}
            />
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <PricingCard
              icon={<Zap className="w-5 h-5" />}
              title="Basic"
              price={isYearly ? "₹552" : "₹69"}
              period={isYearly ? "per year" : "per month"}
              description="For small teams and projects"
              features={[
                "Up to 500 short links",
                "Unlimited API Calls",
                "Basic analytics"
              ]}
              ctaText="Start Free Trial"
              isYearly={isYearly}
            />
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <PricingCard
              icon={<Crown className="w-5 h-5" />}
              title="Pro"
              price={isYearly ? "₹2,152" : "₹269"}
              period={isYearly ? "per year" : "per month"}
              description="For growing businesses"
              features={[
                "Up to 10,000 short links",
                "Unlimited API Calls",
                "Advanced analytics",
                "Additional API access"
              ]}
              highlighted
              ctaText="Start Free Trial"
              badge="Most Popular"
              isYearly={isYearly}
            />
          </motion.div>
          
          <motion.div variants={cardVariants}>
            <PricingCard
              icon={<Shield className="w-5 h-5" />}
              title="Enterprise"
              price="Custom"
              period="contact us"
              description="For large organizations"
              features={[
                "Unlimited short links",
                "Unlimited API Calls",
                "Advanced analytics",
                "Additional API access"
              ]}
              ctaText="Contact Sales"
              enterprise
              isYearly={isYearly}
            />
          </motion.div>
        </motion.div>

        {/* FAQ section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-gray-600 mb-4">
            All plans include our core features with a 14-day free trial
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-themeColor" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-themeColor" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-themeColor" />
              <span>24/7 support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const PricingCard = ({ 
  icon, 
  title, 
  price, 
  period, 
  description, 
  features, 
  highlighted = false, 
  enterprise = false,
  ctaText = "Get Started",
  badge,
  isYearly
}) => (
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
    {badge && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-gradient-to-r from-themeColor to-themeColor-dark text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg">
          {badge}
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
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {/* Pricing */}
      <div className="text-center mb-8">
        <div className="flex items-baseline justify-center">
          <span className={`text-4xl font-bold ${
            highlighted ? "text-themeColor" : "text-gray-900"
          }`}>
            {price}
          </span>
          {period && (
            <span className="text-gray-500 text-sm ml-2">/{period}</span>
          )}
        </div>
        {isYearly && title !== "Free" && title !== "Enterprise" && (
          <p className="text-xs text-green-600 mt-2 font-medium">
            Save {title === "Basic" ? "₹276" : "₹1,076"} per year
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
        disabled={title === "Free" || title === "Basic"}
      >
        {title === "Free" || title === "Basic" ? "Coming Soon" : (
          <>
            {ctaText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </div>
  </motion.div>
);

export default PricingSection;