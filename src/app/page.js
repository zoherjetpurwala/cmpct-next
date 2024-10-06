"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Baumans } from "next/font/google";
import { Link, ArrowRight, Check, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GridPattern } from "@/components/ui/animated-grid";
import { cn } from "@/lib/utils";
import { WobbleCard } from "@/components/ui/wobble-card";
import { toast } from "sonner";

const baumans = Baumans({ weight: "400", subsets: ["latin"] });

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const router = useRouter();
  const { user, setUserWithToken } = useUser();
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setIsLoading(false);
      const { jwtToken } = await response.json();
      setUserWithToken(jwtToken);
      setIsLoginModalOpen(false);
      toast.success("Login successful.");
      router.push("/app");
    } else {
      const errorData = await response.json();
      console.error("Login failed:", errorData);
    }
  };

  const handleSignUp = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      setIsLoading(false);
      toast.success("Signup successful.");
      setIsSignUpModalOpen(false);
    } else {
      const errorData = await response.json();
      console.error("Sign-up failed:", errorData);
      // TODO: Show error message to user
    }
  };

  if (user) {
    router.push("/app");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative flex justify-center items-center w-full flex-col overflow-hidden">
        <GridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(1000px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 "
          )}
        />
        <header className="w-[95%] md:w-[85%] mt-5 p-4 px-5 md:px-10 flex shadow-lg bg-white/45 justify-between items-center rounded-full z-10 border border-blue-900/30 backdrop-blur-sm">
          <h1
            className={`${baumans.className} md:text-5xl text-4xl text-blue-800`}
          >
            cmpct.
          </h1>

          <nav>
            <Button
              variant="ghost"
              className="md:mr-4 mr-2"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Login
            </Button>
            <Button
              onClick={() => setIsSignUpModalOpen(true)}
              className="bg-blue-900"
            >
              Sign Up
            </Button>
          </nav>
        </header>

        <section className="min-h-[calc(95vh-80px)] flex items-center">
          <div className="container md:mt-44 mt-20 mx-auto px-4 text-center relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`font-bold mb-6 relative z-10 text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b to-[90%] from-blue-500 to-blue-900 text-center font-sans`}
            >
              Shrink Your Links, Expand Your Reach
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Create short, branded links in seconds and track their performance
              with our powerful analytics.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                size="lg"
                onClick={() => setIsSignUpModalOpen(true)}
                className="bg-blue-900"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="relative mt-20 h-[300px] md:h-[400px] overflow-hidden max-md:hidden">
                <img
                  src="/dashboard.png"
                  alt="Dashboard preview"
                  className="absolute top-0 left-0 border-[20px] border-blue-900/65 rounded-3xl object-cover hidden md:block"
                  style={{ height: "auto", width: "200%" }}
                />
              </div>

              <img
                src="/dashboard.png"
                alt="Dashboard preview"
                className="mt-10 bottom-3 border-[10px] border-blue-900/65 rounded-xl object-cover  md:hidden"
                style={{ height: "100%", width: "100%" }}
              />
            </motion.div>

            {/* Image Box Section */}
          </div>
        </section>
      </div>
      <div>
        {/* Features Section */}
        <section className="bg-white py-10">
          <div className="container mx-auto  px-4">
            <h3 className="py-10 font-bold  mb-6  relative z-10 text-4xl md:text-4xl  bg-clip-text text-transparent bg-gradient-to-b to-[90%] from-blue-500 to-blue-900  text-center font-sans">
              Powerful Features
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Link className="w-8 h-8 text-blue-900" />}
                title="Custom Short Links"
                description="Create branded and memorable URLs that reflect your brand identity."
              />
              <FeatureCard
                icon={<ArrowRight className="w-8 h-8 text-blue-900" />}
                title="Advanced Analytics"
                description="Track clicks, geographic data, and more with our comprehensive analytics dashboard."
              />
              <FeatureCard
                icon={<Check className="w-8 h-8 text-blue-900" />}
                title="Link Management"
                description="Organize, edit, and manage all your links from one central dashboard."
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Simple, Transparent Pricing
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <PricingCard
                title="Basic"
                price="$0"
                features={[
                  "Up to 1,000 short links",
                  "Basic analytics",
                  "Standard support",
                ]}
              />
              <PricingCard
                title="Pro"
                price="$19"
                features={[
                  "Up to 10,000 short links",
                  "Advanced analytics",
                  "Priority support",
                  "Custom domains",
                ]}
                highlighted
              />
              <PricingCard
                title="Enterprise"
                price="Custom"
                features={[
                  "Unlimited short links",
                  "Enterprise-grade analytics",
                  "Dedicated support",
                  "API access",
                ]}
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              What Our Customers Say
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="cmpct has revolutionized our marketing campaigns. The analytics are invaluable!"
                author="Jane Doe"
                company="Tech Innovators Inc."
              />
              <TestimonialCard
                quote="Easy to use, powerful features, and great customer support. Highly recommended!"
                author="John Smith"
                company="Global Merchants Ltd."
              />
            </div>
          </div>
        </section>
      </div>
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className={`${baumans.className} text-2xl font-bold mb-4`}>
                cmpct.
              </h4>
              <p className="text-gray-400">
                Shrink your links, expand your reach
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} cmpct. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Login Modal */}
      <AuthModal
        isOpen={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        onSubmit={handleLogin}
        title="Login to cmpct."
        description="Enter your credentials to access your account"
        buttonText="Login"
        isLoading={isLoading}
      />
      {/* Sign Up Modal */}
      <AuthModal
        isOpen={isSignUpModalOpen}
        onOpenChange={setIsSignUpModalOpen}
        onSubmit={handleSignUp}
        title="Sign Up for cmpct."
        description="Enter your details to create a new account"
        buttonText="Sign Up"
        isLoading={isLoading}
      />
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-blue-900/25 border border-blue-900/35 shadow-lg">
      <div className="mb-4 flex gap-3 items-center">
        {icon}
        <h2 className="text-left text-balance text-xl md:text-2xl lg:text-3xl font-semibold tracking-[-0.015em] text-blue-900">
          {title}
        </h2>
      </div>

      <p className="mt-4 text-left  text-base/6 text-blue-900/65">
        {description}
      </p>
    </WobbleCard>
    // <div className="bg-gray-50 p-6 rounded-lg shadow-sm">

    // </div>
  );
}

function PricingCard({ title, price, features, highlighted = false }) {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm ${
        highlighted ? "ring-2 ring-blue-500" : ""
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
      <Button className="w-full" variant={highlighted ? "default" : "outline"}>
        Choose Plan
      </Button>
    </div>
  );
}

function TestimonialCard({ quote, author, company }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex mb-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <Star key={index} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-gray-600 mb-4">&ldquo;{quote}&rdquo;</p>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-gray-500">{company}</p>
    </div>
  );
}

function AuthModal({
  isOpen,
  onOpenChange,
  onSubmit,
  title,
  description,
  buttonText,
  isLoading
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{title}</DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait...
              </span>
            ) : (
              buttonText
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
