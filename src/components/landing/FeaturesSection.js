import { Link, ArrowRight, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { WobbleCard } from "@/components/ui/wobble-card";

const FeaturesSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
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
    <section className="bg-gradient-to-b from-white via-themeColor-light/10 to-white py-32 border-b-2 border-themeColor-border rounded-b-3xl relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-themeColor/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -left-20 w-32 h-32 bg-themeColor/8 rounded-full blur-2xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-themeColor-light/50 text-themeColor-text text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Why Choose Us</span>
          </div>
          <h3 className="font-bold relative z-10 text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b to-[90%] from-themeColor to-themeColor-dark text-center font-sans mb-4">
            Powerful Features
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Everything you need to create, manage, and optimize your short links with advanced analytics and seamless integration.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 md:gap-12"
        >
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<Link className="w-8 h-8 text-themeColor" />}
              title="TRAI Compliant"
              description="Create TRAI Compliant links with HEADER support that reflect your brand identity and ensure regulatory compliance."
              features={["Custom headers", "Brand compliance", "Regulatory safety"]}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<ArrowRight className="w-8 h-8 text-themeColor" />}
              title="Advanced Analytics"
              description="Track clicks, geographic data, and user behavior with our comprehensive real-time analytics dashboard."
              features={["Real-time tracking", "Geographic insights", "User behavior analysis"]}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <FeatureCard
              icon={<Check className="w-8 h-8 text-themeColor" />}
              title="Link Management"
              description="Organize, edit, and manage all your links from one central dashboard with powerful bulk operations."
              features={["Bulk operations", "Smart organization", "Easy editing"]}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description, features }) => (
  <WobbleCard containerClassName="col-span-1 min-h-[350px] bg-gradient-to-br from-white to-themeColor-light/30 border border-themeColor/20 shadow-lg shadow-themeColor/8 hover:shadow-xl hover:shadow-themeColor/15 transition-all duration-300">
    <div className="relative z-10">
      {/* Icon with background */}
      <div className="mb-6 flex items-center justify-center w-16 h-16 bg-themeColor/10 rounded-2xl border border-themeColor/20">
        {icon}
      </div>
      
      {/* Title */}
      <h2 className="text-left text-balance text-xl md:text-2xl font-bold tracking-[-0.015em] text-themeColor-text mb-3">
        {title}
      </h2>
      
      {/* Description */}
      <p className="text-left text-base leading-relaxed text-gray-700 mb-4">
        {description}
      </p>
      
      {/* Feature list */}
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <div className="w-1.5 h-1.5 bg-themeColor rounded-full mr-3 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  </WobbleCard>
);

export default FeaturesSection;