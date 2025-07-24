import { Baumans } from "next/font/google";
import { Loader2, Mail, CheckCircle } from "lucide-react";
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
import { useState } from "react";

const baumans = Baumans({ weight: "400", subsets: ["latin"] });

const AuthModal = ({
  type,
  isOpen,
  onOpenChange,
  onSubmit,
  title,
  description,
  buttonText,
  isLoading,
  onTypeChange, // New prop to switch between login/signup
}) => {
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    setUserEmail(email);

    const result = await onSubmit(e);
    
    // If signup was successful and requires verification
    if (result?.requiresVerification && type === "SignUp") {
      setShowVerificationMessage(true);
    }
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });

      if (response.ok) {
        // Could add a toast notification here
        console.log('Verification email resent successfully');
      }
    } catch (error) {
      console.error('Error resending email:', error);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    setShowVerificationMessage(false);
    setUserEmail("");
    if (onTypeChange) {
      onTypeChange("Login");
    }
  };

  const handleDialogClose = () => {
    setShowVerificationMessage(false);
    setUserEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="bg-white sm:max-w-[425px] border border-themeColor-border/30 shadow-xl shadow-themeColor/10">
        <DialogHeader>
          <DialogTitle className="text-themeColor-text text-2xl text-center">
            {showVerificationMessage ? (
              <>
                Check Your Email <Mail className="inline-block h-6 w-6 ml-2 text-themeColor" />
              </>
            ) : type === "SignUp" ? (
              <>
                SignUp for <span className={`${baumans.className} text-themeColor`}>cmpct.</span>
              </>
            ) : (
              <>
                Login to <span className={`${baumans.className} text-themeColor`}>cmpct.</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {showVerificationMessage 
              ? "We've sent you a verification link" 
              : description
            }
          </DialogDescription>
        </DialogHeader>

        {showVerificationMessage ? (
          <div className="flex flex-col space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Email Sent Successfully!</p>
                  <p className="text-green-700 text-sm mt-1">
                    We've sent a verification link to <strong>{userEmail}</strong>. 
                    Please check your email and click the link to verify your account.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-600 text-sm">
              <p>Didn't receive the email? Check your spam folder or</p>
              <Button
                variant="link"
                onClick={handleResendEmail}
                disabled={resendLoading}
                className="text-themeColor hover:text-themeColor-dark p-0 h-auto font-medium"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="animate-spin h-3 w-3 mr-1" />
                    Resending...
                  </>
                ) : (
                  "resend verification email"
                )}
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm mb-3">
                Already verified your email?
              </p>
              <Button
                onClick={handleSwitchToLogin}
                className="w-full bg-themeColor hover:bg-themeColor-dark text-white shadow-lg shadow-themeColor/25 font-medium transition-all duration-300"
              >
                Continue to Login
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
            {type === "SignUp" && (
              <>
                <Label htmlFor={`${type}-name`} className="text-themeColor-text font-medium">
                  Name
                </Label>
                <Input 
                  id={`${type}-name`} 
                  name="name" 
                  type="text" 
                  required 
                  className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
                />
                <Label htmlFor={`${type}-phone`} className="text-themeColor-text font-medium">
                  Phone
                </Label>
                <Input
                  id={`${type}-phone`}
                  name="phone"
                  type="tel"
                  pattern="^\d{10}$"
                  required
                  className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
                />
              </>
            )}
            <Label htmlFor={`${type}-email`} className="text-themeColor-text font-medium">
              Email
            </Label>
            <Input 
              id={`${type}-email`} 
              name="email" 
              type="email" 
              required 
              className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
            />
            <Label htmlFor={`${type}-password`} className="text-themeColor-text font-medium">
              Password
            </Label>
            <Input
              id={`${type}-password`}
              name="password"
              type="password"
              required
              className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
            />
            <Button 
              type="submit" 
              className="mt-4 bg-themeColor hover:bg-themeColor-dark text-white shadow-lg shadow-themeColor/25 font-medium transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Loading... <Loader2 className="animate-spin h-5 w-5 ml-2" />
                </>
              ) : (
                buttonText
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;