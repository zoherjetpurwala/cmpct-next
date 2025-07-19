import { Baumans } from "next/font/google";
import { Loader2 } from "lucide-react";
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
}) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="bg-white sm:max-w-[425px] border border-themeColor-border/30 shadow-xl shadow-themeColor/10">
      <DialogHeader>
        <DialogTitle className="text-themeColor-text text-2xl text-center">
          {type === "SignUp" ? (
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
          {description}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="flex flex-col space-y-4">
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
    </DialogContent>
  </Dialog>
);

export default AuthModal;