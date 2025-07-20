import { motion } from "framer-motion";
import { Check } from "lucide-react";
import PaymentButton from "@/components/profile-components/PaymentButton";

export const PricingCard = ({
  user,
  plan,
  highlighted = false,
  disabled = false,
  index,
  billingCycle = 'monthly'
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
            <div className="text-sm text-gray-500">
              per {billingCycle === 'yearly' ? 'year' : 'month'}
              {billingCycle === 'yearly' && plan.title !== 'Free' && (
                <div className="text-xs text-green-600 mt-1">
                  (1 month free included)
                </div>
              )}
            </div>
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
          <PaymentButton
            userId={user.id}
            plan={plan.title.toLowerCase()}
            billingCycle={billingCycle}
            disabled={disabled}
            highlighted={plan.popular}
          >
            {disabled ? "Current or Lower Tier" : "Upgrade Now"}
          </PaymentButton>
        )}
      </div>
    </motion.div>
  );
};