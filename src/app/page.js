"use client";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
import { signIn, useSession } from "next-auth/react";
import TextUI from "@/components/ui/text-ui";

const baumans = Baumans({ weight: "400", subsets: ["latin"] });

export default function LandingPage() {
	const [authState, setAuthState] = useState({
		isLoginModalOpen: false,
		isSignUpModalOpen: false,
		isLoading: false,
	});
	const router = useRouter();
	const { data: session, status } = useSession(); // Use NextAuth session
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 20;
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [scrolled]);

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

	// Return null if user is already logged in (to avoid rendering unnecessary content)
	if (status === "loading") return null;
	if (session) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="relative flex justify-center items-center w-full flex-col overflow-hidden border-b-2 border-blue-900/50 rounded-b-3xl">
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
				<Header
					onLoginClick={() =>
						setAuthState((prev) => ({ ...prev, isLoginModalOpen: true }))
					}
					onSignUpClick={() =>
						setAuthState((prev) => ({ ...prev, isSignUpModalOpen: true }))
					}
					scrolled={scrolled}
				/>
				<HeroSection
					onSignUpClick={() =>
						setAuthState((prev) => ({ ...prev, isSignUpModalOpen: true }))
					}
				/>
			</div>

			<FeaturesSection />
			<PricingSection />
			{/* <TestimonialsSection /> */}
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

const Header = ({ onLoginClick, onSignUpClick, scrolled }) => (
	<motion.header
		className={`fixed top-0 left-0 right-0 w-full z-50 flex justify-center ${
			scrolled ? "py-2" : "py-4"
		}`}
		initial={{ y: -100 }}
		animate={{ y: 0 }}
		transition={{ duration: 0.5, ease: "easeOut" }}
	>
		<motion.div
			className={`w-[95%] md:w-[85%] mt-5 max-sm:mt-1 p-4 px-5 md:px-10 flex justify-between items-center rounded-full border border-blue-900/20 backdrop-blur-md ${
				scrolled
					? "bg-white/75 shadow-lg shadow-blue-800/20"
					: "bg-white/45 shadow-lg shadow-blue-800/35"
			}`}
			transition={{ duration: 0.3 }}
		>
			<motion.h1
				className={`${baumans.className} md:text-5xl text-4xl text-blue-800`}
				whileHover={{ scale: 1.05 }}
				transition={{ type: "spring", stiffness: 400, damping: 10 }}
			>
				cmpct.
			</motion.h1>

			<nav className="flex items-center">
				<motion.button
					className="px-4 py-2 mx-2 text-blue-800 rounded-full hover:bg-blue-50 transition-colors"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onLoginClick}
				>
					Login
				</motion.button>

				<motion.button
					className="px-4 py-2 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors"
					whileHover={{
						scale: 1.05,
						boxShadow: "0 0 8px rgba(30, 64, 175, 0.6)",
					}}
					whileTap={{ scale: 0.95 }}
					onClick={onSignUpClick}
				>
					Sign Up
				</motion.button>
			</nav>
		</motion.div>
	</motion.header>
);

const HeroSection = ({ onSignUpClick }) => (
	<section className="min-h-[calc(95vh-80px)] flex items-center">
		<div className="container md:mt-52 mt-44 mx-auto px-4 text-center relative z-10">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="font-bold mb-6 relative z-10 text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b to-[90%] from-blue-500 to-blue-900 text-center font-sans"
			>
				Shrink Your Links, Expand Your Reach
			</motion.h2>
			<motion.p
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
			>
				Create short, branded links in seconds and track their performance with
				our powerful analytics.
			</motion.p>

			<TextUI />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
			>
				<Button
					size="lg"
					onClick={onSignUpClick}
					className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all duration-300"
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
					className="mt-10 bottom-3 border-[10px] border-blue-900/65 rounded-xl object-cover md:hidden"
					style={{ height: "100%", width: "100%" }}
				/>
			</motion.div>
		</div>
	</section>
);

const AuthModal = ({
	type,
	isOpen,
	onOpenChange,
	onSubmit,
	title,
	description,
	buttonText,
	isLoading,
}) => (
	<Dialog open={isOpen} onOpenChange={onOpenChange}>
		<DialogContent className="bg-white sm:max-w-[425px]">
			<DialogHeader>
				<DialogTitle className="text-blue-900 text-2xl text-center">
					{type === "SignUp" ? (
						<>
							SignUp for <span className={`${baumans.className}`}>cmpct.</span>
						</>
					) : (
						<>
							Login to <span className={`${baumans.className}`}>cmpct.</span>
						</>
					)}
				</DialogTitle>
				<DialogDescription className="text-center text-gray-500">
					{description}
				</DialogDescription>
			</DialogHeader>
			<form onSubmit={onSubmit} className="flex flex-col space-y-4">
				{type === "SignUp" && (
					<>
						<Label htmlFor={`${type}-name`}>Name</Label>
						<Input id={`${type}-name`} name="name" type="text" required />
						<Label htmlFor={`${type}-phone`}>Phone</Label>
						<Input
							id={`${type}-phone`}
							name="phone"
							type="tel"
							pattern="^\d{10}$"
							required
						/>
					</>
				)}
				<Label htmlFor={`${type}-email`}>Email</Label>
				<Input id={`${type}-email`} name="email" type="email" required />
				<Label htmlFor={`${type}-password`}>Password</Label>
				<Input
					id={`${type}-password`}
					name="password"
					type="password"
					required
				/>
				<Button type="submit" className="mt-4 bg-blue-950" disabled={isLoading}>
					{isLoading ? (
						<>
							Loading... <Loader2 className="animate-spin h-5 w-5 ml-2" />
						</>
					) : (
						buttonText
					)}
				</Button>
			</form>
		</DialogContent>
	</Dialog>
);

const FeaturesSection = () => (
	<section className="bg-white py-32 border-b-2 border-blue-900/50 rounded-b-3xl">
		<div className="container mx-auto px-4">
			<h3 className="pb-20 font-bold  relative z-10 text-4xl bg-clip-text text-transparent bg-gradient-to-b to-[90%] from-blue-500 to-blue-900 text-center font-sans">
				Powerful Features
			</h3>
			<div className="grid md:grid-cols-3 gap-8 md:gap-20">
				<FeatureCard
					icon={<Link className="w-8 h-8 text-blue-900" />}
					title="TRAI Compliant"
					description="Create TRAI Compliant links with HEADER support that reflect your brand identity."
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
);

const PricingSection = () => (
	<section className="py-20">
		<div className="container mx-auto px-4">
			<h3 className="py-10 font-bold mb-6 relative z-10 text-4xl bg-clip-text text-transparent bg-gradient-to-b to-[90%] from-blue-500 to-blue-900 text-center font-sans">
				Simple, Transparent Pricing
			</h3>
			<div className="grid md:grid-cols-4 gap-8">
				<PricingCard
					title="Free"
					price="Free"
					features={[
						"Up to 1,000 short links",
						"Basic analytics",
						"Standard support",
					]}
				/>
				<PricingCard
					title="Basic"
					price="₹69"
					features={[
						"Up to 500 short links",
						"Unlimited API Calls",
						"Basic analytics",
					]}
				/>
				<PricingCard
					title="Pro"
					price="₹269"
					features={[
						"Up to 10,000 short links",
						"Unlimited API Calls",
						"Advanced analytics",
						"Additional API access",
					]}
					highlighted
				/>
				<PricingCard
					title="Enterprise"
					price="Custom"
					features={[
						"Unlimited short links",
						"Unlimited API Calls",
						"Advanced analytics",
						"Additional API access",
					]}
				/>
			</div>
		</div>
	</section>
);

const TestimonialsSection = () => (
	<section className="bg-gray-50 py-20">
		<div className="container mx-auto px-4">
			<h3 className="py-10 font-bold mb-6 relative z-10 text-4xl bg-clip-text text-transparent bg-gradient-to-b to-[90%] from-blue-500 to-blue-900 text-center font-sans">
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
);

const Footer = () => (
	<footer className="bg-blue-950 rounded-t-3xl text-white py-12">
		<div className="container mx-auto px-4">
			<div className="grid md:grid-cols-4 gap-8">
				<div>
					<h4 className={`${baumans.className} text-2xl font-bold mb-4`}>
						cmpct.
					</h4>
					<p className="text-gray-400">Shrink your links, expand your reach</p>
				</div>
				<FooterColumn title="Product" links={["Features", "Pricing", "API"]} />
				<FooterColumn
					title="Company"
					links={["About Us", "Careers", "Contact"]}
				/>
				<FooterColumn
					title="Legal"
					links={["Privacy Policy", "Terms of Service"]}
				/>
			</div>
			<div className="mt-8 pt-8 border-t border-gray-500/50 text-center text-gray-400">
				<p>&copy; {new Date().getFullYear()} cmpct. All rights reserved.</p>
			</div>
		</div>
	</footer>
);

const FooterColumn = ({ title, links }) => (
	<div>
		<h5 className="font-semibold mb-4">{title}</h5>
		<ul className="space-y-2">
			{links.map((link, index) => (
				<li key={index}>
					<a href="#" className="text-gray-400 hover:text-white transition">
						{link}
					</a>
				</li>
			))}
		</ul>
	</div>
);

const FeatureCard = ({ icon, title, description }) => (
	<WobbleCard containerClassName="col-span-1 min-h-[300px] bg-blue-900/25 border border-blue-900/35 shadow-lg">
		<div className="mb-4 flex gap-3 items-center">
			{icon}
			<h2 className="text-left text-balance text-xl md:text-2xl lg:text-3xl font-semibold tracking-[-0.015em] text-blue-900">
				{title}
			</h2>
		</div>
		<p className="mt-4 text-left text-base/6 text-blue-900/65">{description}</p>
	</WobbleCard>
);

const PricingCard = ({ title, price, features, highlighted = false }) => (
	<div
		className={`bg-white p-6 rounded-lg shadow-sm ${
			highlighted ? "ring-2 ring-blue-900/50" : ""
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
		<Button
			className={`w-full ${highlighted ? "bg-blue-900" : ""}`}
			variant={highlighted ? "default" : "outline"}
			disabled
		>
			Coming Soon
		</Button>
	</div>
);

const TestimonialCard = ({ quote, author, company }) => (
	<div className="bg-white p-6 rounded-lg shadow-sm">
		<div className="flex mb-4">
			{[...Array(5)].map((_, index) => (
				<Star key={index} className="w-5 h-5 text-yellow-400" />
			))}
		</div>
		<p className="text-gray-600 mb-4">&quot;{quote}&quot;</p>
		<div>
			<p className="font-semibold">{author}</p>
			<p className="text-sm text-gray-500">{company}</p>
		</div>
	</div>
);
