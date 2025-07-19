"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

// Component imports
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";
import AuthModal from "@/components/landing/AuthModal";

export default function LandingPage() {
  const [authState, setAuthState] = useState({
    isLoginModalOpen: false,
    isSignUpModalOpen: false,
    isLoading: false,
  });
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/app");
    }
  }, [session, router]);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const formData = Object.fromEntries(new FormData(e.target));

      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result.error) {
          toast.error(result.error || "Login failed. Please try again.");
        } else {
          toast.success("Login successful.");
          router.push("/app");
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
        console.log(error);
      } finally {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    },
    [router]
  );

  const handleSignUp = useCallback(async (e) => {
    e.preventDefault();
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const formData = Object.fromEntries(new FormData(e.target));

    try {
      const response = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Sign-up successful. Please log in.");
        setAuthState((prev) => ({
          ...prev,
          isSignUpModalOpen: false,
          isLoginModalOpen: true,
        }));
      } else {
        const errorData = await response.json();
        toast.error(errorData?.message || "Sign-up failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Sign-up error:", error);
    } finally {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const openLoginModal = () =>
    setAuthState((prev) => ({ ...prev, isLoginModalOpen: true }));

  const openSignUpModal = () =>
    setAuthState((prev) => ({ ...prev, isSignUpModalOpen: true }));

  if (status === "loading") return null;
  if (session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-themeColor-light/20 via-white to-themeColor-muted/30">
      <div className="relative flex justify-center items-center w-full flex-col overflow-hidden border-b-2 border-themeColor-border rounded-b-3xl">
        {/* Enhanced base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-themeColor-light/30 via-white to-themeColor-muted/40" />

        {/* Static gradient orbs with enhanced design */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large primary orbs */}
          <div className="absolute -top-40 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-themeColor/20 via-themeColor/10 to-transparent rounded-full blur-3xl opacity-80" />
          <div className="absolute -bottom-32 -left-24 w-[500px] h-[500px] bg-gradient-to-tr from-themeColor-dark/15 via-themeColor/8 to-transparent rounded-full blur-3xl opacity-70" />
          
          {/* Medium accent orbs */}
          <div className="absolute top-20 right-20 w-[350px] h-[350px] bg-gradient-to-bl from-themeColor-muted/25 via-themeColor-light/15 to-transparent rounded-full blur-2xl opacity-60" />
          <div className="absolute bottom-40 right-1/4 w-[280px] h-[280px] bg-gradient-to-tl from-themeColor/18 via-themeColor-light/12 to-transparent rounded-full blur-2xl opacity-65" />
          
          {/* Small decorative orbs */}
          <div className="absolute top-1/3 left-1/5 w-[200px] h-[200px] bg-gradient-to-br from-themeColor-light/30 via-themeColor/15 to-transparent rounded-full blur-xl opacity-50" />
          <div className="absolute bottom-1/3 left-1/2 w-[180px] h-[180px] bg-gradient-to-tr from-themeColor-muted/35 via-themeColor/20 to-transparent rounded-full blur-xl opacity-55" />
          <div className="absolute top-1/2 right-1/6 w-[150px] h-[150px] bg-gradient-to-bl from-themeColor/25 via-themeColor-light/18 to-transparent rounded-full blur-lg opacity-45" />
          
          {/* Additional subtle orbs for depth */}
          <div className="absolute top-1/4 left-1/3 w-[240px] h-[240px] bg-gradient-to-r from-themeColor-light/20 via-themeColor/12 to-transparent rounded-full blur-2xl opacity-40" />
          <div className="absolute bottom-1/4 right-1/3 w-[120px] h-[120px] bg-gradient-to-tl from-themeColor-muted/40 via-themeColor/25 to-transparent rounded-full blur-lg opacity-50" />
          <div className="absolute top-3/4 left-1/6 w-[90px] h-[90px] bg-gradient-to-br from-themeColor/30 via-themeColor-light/20 to-transparent rounded-full blur-md opacity-60" />
          
          {/* Micro orbs for texture */}
          <div className="absolute top-1/6 right-1/2 w-[60px] h-[60px] bg-gradient-to-bl from-themeColor-light/50 to-transparent rounded-full blur-sm opacity-40" />
          <div className="absolute bottom-1/6 left-2/3 w-[80px] h-[80px] bg-gradient-to-tr from-themeColor/35 to-transparent rounded-full blur-sm opacity-45" />
        </div>

        {/* Enhanced layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-themeColor-light/15 via-transparent to-themeColor-muted/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-themeColor-light/10 via-transparent to-themeColor-light/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Header and Hero */}
        <Header onLoginClick={openLoginModal} onSignUpClick={openSignUpModal} />
        <HeroSection onSignUpClick={openSignUpModal} />
      </div>

      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <Footer />

      <AuthModal
        type="Login"
        isOpen={authState.isLoginModalOpen}
        onOpenChange={(open) =>
          setAuthState((prev) => ({ ...prev, isLoginModalOpen: open }))
        }
        onSubmit={handleLogin}
        title="Login to cmpct."
        description="Enter your credentials to access your account"
        buttonText="Login"
        isLoading={authState.isLoading}
      />

      <AuthModal
        type="SignUp"
        isOpen={authState.isSignUpModalOpen}
        onOpenChange={(open) =>
          setAuthState((prev) => ({ ...prev, isSignUpModalOpen: open }))
        }
        onSubmit={handleSignUp}
        title="Sign Up for cmpct."
        description="Enter your details to create a new account"
        buttonText="Sign Up"
        isLoading={authState.isLoading}
      />
    </div>
  );
}