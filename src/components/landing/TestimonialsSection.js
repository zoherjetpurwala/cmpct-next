import { Star, Quote, Users } from "lucide-react";
import { motion } from "framer-motion";

const TestimonialsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
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
    <section className="bg-gradient-to-br from-themeColor-light/20 via-white to-themeColor-muted/30 py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-10 w-32 h-32 bg-themeColor/10 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-10 left-10 w-24 h-24 bg-themeColor/15 rounded-full blur-xl"
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
            <Users className="w-4 h-4" />
            <span>Customer Love</span>
          </div>
          <h3 className="font-bold mb-4 relative z-10 text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b to-[90%] from-themeColor to-themeColor-dark text-center font-sans">
            What Our Customers Say
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Join thousands of satisfied customers who trust cmpct for their link management needs.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <TestimonialCard
              quote="cmpct has revolutionized our marketing campaigns. The analytics are invaluable and the interface is incredibly intuitive!"
              author="Sarah Chen"
              company="Tech Innovators Inc."
              role="Marketing Director"
              avatar="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <TestimonialCard
              quote="Easy to use, powerful features, and great customer support. Our team productivity has increased by 40%!"
              author="Michael Rodriguez"
              company="Global Merchants Ltd."
              role="Operations Manager"
              avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-1">
            <TestimonialCard
              quote="The TRAI compliance features are exactly what we needed. Finally, a solution that understands our regulatory requirements."
              author="Priya Sharma"
              company="Digital Solutions India"
              role="Compliance Head"
              avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face"
            />
          </motion.div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-themeColor fill-current" />
              <span className="font-semibold">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-themeColor" />
              <span className="font-semibold">10,000+ Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-themeColor rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="font-semibold">99.9% Uptime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ quote, author, company, role, avatar }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-themeColor/10 hover:shadow-xl hover:shadow-themeColor/10 transition-all duration-300 group relative overflow-hidden"
  >
    {/* Subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-themeColor/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    
    {/* Quote icon */}
    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Quote className="w-8 h-8 text-themeColor" />
    </div>
    
    <div className="relative z-10">
      {/* Stars */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Star className="w-4 h-4 text-themeColor fill-current" />
          </motion.div>
        ))}
      </div>
      
      {/* Quote */}
      <p className="text-gray-700 mb-6 text-base leading-relaxed font-medium">
        &quot;{quote}&quot;
      </p>
      
      {/* Author info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-themeColor/20">
          <img 
            src={avatar} 
            alt={author}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-full h-full bg-themeColor-light flex items-center justify-center text-themeColor font-bold text-lg hidden">
            {author.charAt(0)}
          </div>
        </div>
        <div>
          <p className="font-semibold text-themeColor-text">{author}</p>
          <p className="text-sm text-gray-600">{role}</p>
          <p className="text-xs text-gray-500">{company}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default TestimonialsSection;