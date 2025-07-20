import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  BarChart2,
  LinkIcon,
  Crown,
  Shield,
  Zap,
  Star,
  Edit3,
  Save,
  X,
  RefreshCw
} from "lucide-react";

const tierColors = {
  free: "bg-gray-500",
  basic: "bg-themeColor",
  pro: "bg-gradient-to-r from-themeColor to-themeColor-dark",
  enterprise: "bg-gradient-to-r from-themeColor-dark to-themeColor-text",
};

const tierIcons = {
  free: Star,
  basic: Zap,
  pro: Crown,
  enterprise: Shield
};

export const UserInfoCard = ({
  session,
  isEditing,
  setIsEditing,
  formData,
  isUpdating,
  isRefreshing,
  handleInputChange,
  handleUpdateProfile,
  refreshSession,
  cancelEditing
}) => {
  const TierIcon = tierIcons[session?.user.currentTier] || Star;

  return (
    <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-themeColor to-themeColor-dark rounded-2xl flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-themeColor-text">User Profile</CardTitle>
              <CardDescription className="text-gray-600">
                Manage your account information and settings
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-gray-600">Account Tier</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshSession}
                disabled={isRefreshing}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            <Badge className={`${tierColors[session?.user.currentTier]} text-white px-4 py-2 text-sm font-medium`}>
              <TierIcon className="w-4 h-4 mr-2" />
              {session?.user.currentTier?.charAt(0).toUpperCase() + session?.user.currentTier?.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-themeColor-text font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="fullName"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-themeColor-text font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-themeColor-text font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memberSince" className="text-themeColor-text font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Member Since
              </Label>
              <Input
                id="memberSince"
                value={new Date(session?.user.createdAt || Date.now()).toLocaleDateString()}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200"
            >
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-themeColor-text font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-themeColor-text font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className="border-gray-300 focus:border-themeColor focus:ring-themeColor/20"
                />
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3 p-3 bg-themeColor-light/20 rounded-xl">
            <BarChart2 className="w-5 h-5 text-themeColor" />
            <div>
              <div className="text-sm text-gray-600">API Calls Today</div>
              <div className="font-semibold text-themeColor-text">{session?.user.apiCallsToday || 0}</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-themeColor-light/20 rounded-xl">
            <LinkIcon className="w-5 h-5 text-themeColor" />
            <div>
              <div className="text-sm text-gray-600">Total Links</div>
              <div className="font-semibold text-themeColor-text">{session?.user.linkCount || 0}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-themeColor hover:bg-themeColor-dark text-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={cancelEditing}
                className="border-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                className="bg-themeColor hover:bg-themeColor-dark text-white"
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Updating...
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
