import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Star,
  Crown,
  Shield,
  LinkIcon,
  BarChart2,
  Users,
  Settings,
  ExternalLink,
  Download,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const tierIcons = {
  free: Star,
  basic: Zap,
  pro: Crown,
  enterprise: Shield
};

const tierColors = {
  free: "bg-gray-500",
  basic: "bg-themeColor",
  pro: "bg-gradient-to-r from-themeColor to-themeColor-dark",
  enterprise: "bg-gradient-to-r from-themeColor-dark to-themeColor-text",
};

const tierLimits = {
  free: {
    links: 1000,
    apiCalls: 100,
    features: ["Basic analytics", "Standard support"]
  },
  basic: {
    links: 10000,
    apiCalls: -1, // Unlimited
    features: ["Advanced analytics", "Email support", "Custom domains"]
  },
  pro: {
    links: 100000,
    apiCalls: -1, // Unlimited
    features: ["Advanced analytics", "Team collaboration", "Priority support", "White-label"]
  },
  enterprise: {
    links: -1, // Unlimited
    apiCalls: -1, // Unlimited
    features: ["All Pro features", "Dedicated support", "Custom integrations", "SLA guarantee"]
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculateDaysUntilExpiry = (expirationDate) => {
  if (!expirationDate) return null;
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getUsagePercentage = (current, limit) => {
  if (limit === -1) return 0; // Unlimited
  return Math.min((current / limit) * 100, 100);
};

export const SubscriptionDetailsCard = ({ user, refreshSession }) => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentTier = user?.currentTier || 'free';
  const TierIcon = tierIcons[currentTier];
  const limits = tierLimits[currentTier];

  console.log("user", user);
  
  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock subscription data - replace with actual API
        setSubscriptionData({
          currentPeriodStart: user?.createdAt || new Date().toISOString(),
          currentPeriodEnd: user?.billingCycle === 'yearly' 
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          billingCycle: user?.billingCycle || 'monthly',
          status: 'active',
          nextBillingDate: user?.billingCycle === 'yearly'
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          autoRenew: true
        });
      } catch (error) {
        toast.error("Failed to load subscription details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshSession();
      // Refetch subscription data
      const response = await fetch('/api/user/subscription-details');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
      }
    } catch (error) {
      toast.error("Failed to refresh subscription data");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-themeColor/30 border-t-themeColor rounded-full animate-spin" />
            <span className="ml-3 text-gray-600">Loading subscription details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const daysUntilExpiry = calculateDaysUntilExpiry(subscriptionData?.currentPeriodEnd);
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry <= 0;

  // Usage calculations
  const linkUsage = getUsagePercentage(user?.linkCount || 0, limits.links);
  const apiUsage = limits.apiCalls === -1 ? 0 : getUsagePercentage(user?.apiCallsToday || 0, limits.apiCalls);

  return (
    <Card className="rounded-2xl border border-themeColor/20 bg-gradient-to-br from-white to-themeColor-light/5 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-themeColor/10 rounded-xl">
              <CreditCard className="h-6 w-6 text-themeColor" />
            </div>
            <div>
              <CardTitle className="text-2xl text-themeColor-text">Current Subscription</CardTitle>
              <CardDescription className="text-gray-600">
                Manage your subscription and view usage details
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-gray-500 hover:text-themeColor"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Plan Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-themeColor-text">Plan Details</h3>
              {subscriptionData?.status && (
                <Badge 
                  variant={subscriptionData.status === 'active' ? 'default' : 'destructive'}
                  className={subscriptionData.status === 'active' ? 'bg-green-600' : ''}
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {subscriptionData.status.charAt(0).toUpperCase() + subscriptionData.status.slice(1)}
                </Badge>
              )}
            </div>

            <div className="p-4 bg-themeColor-light/10 rounded-xl border border-themeColor/20">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${tierColors[currentTier]} text-white`}>
                  <TierIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-themeColor-text">
                    {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Plan
                  </div>
                  <div className="text-sm text-gray-600">
                    {subscriptionData?.billingCycle === 'yearly' ? 'Yearly' : 'Monthly'} billing
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Period Start:</span>
                  <span className="font-medium">{formatDate(subscriptionData?.currentPeriodStart)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Period End:</span>
                  <span className="font-medium">{formatDate(subscriptionData?.currentPeriodEnd)}</span>
                </div>
                {subscriptionData?.nextBillingDate && currentTier !== 'free' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Billing:</span>
                    <span className="font-medium">{formatDate(subscriptionData.nextBillingDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expiry Warning */}
            {isExpiringSoon && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Subscription Expiring Soon</span>
                </div>
                <p className="text-sm text-orange-600 mt-1">
                  Your subscription expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {isExpired && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Subscription Expired</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Your subscription has expired. Please renew to continue using premium features.
                </p>
              </div>
            )}
          </div>

          {/* Usage Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-themeColor-text">Usage This Period</h3>
            
            {/* Links Usage */}
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-themeColor" />
                  <span className="font-medium">Short Links</span>
                </div>
                <span className="text-sm text-gray-600">
                  {user?.linkCount || 0} / {limits.links === -1 ? '∞' : limits.links.toLocaleString()}
                </span>
              </div>
              {limits.links !== -1 && (
                <Progress 
                  value={linkUsage} 
                  className="h-2" 
                  indicatorClassName={linkUsage > 80 ? 'bg-red-500' : linkUsage > 60 ? 'bg-yellow-500' : 'bg-themeColor'}
                />
              )}
              {limits.links === -1 && (
                <div className="text-sm text-green-600 font-medium">Unlimited</div>
              )}
            </div>

            {/* API Calls Usage */}
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-themeColor" />
                  <span className="font-medium">API Calls (Today)</span>
                </div>
                <span className="text-sm text-gray-600">
                  {user?.apiCallsToday || 0} / {limits.apiCalls === -1 ? '∞' : limits.apiCalls.toLocaleString()}
                </span>
              </div>
              {limits.apiCalls !== -1 && (
                <Progress 
                  value={apiUsage} 
                  className="h-2"
                  indicatorClassName={apiUsage > 80 ? 'bg-red-500' : apiUsage > 60 ? 'bg-yellow-500' : 'bg-themeColor'}
                />
              )}
              {limits.apiCalls === -1 && (
                <div className="text-sm text-green-600 font-medium">Unlimited</div>
              )}
            </div>

            {/* Plan Features */}
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-themeColor" />
                <span className="font-medium">Plan Features</span>
              </div>
              <div className="space-y-1">
                {limits.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          {currentTier !== 'free' && (
            <>
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Invoice
              </Button>
              <Button variant="outline" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Manage Subscription
              </Button>
            </>
          )}
          <Button 
            className="flex-1 bg-themeColor hover:bg-themeColor-dark text-white"
            onClick={() => {
              const element = document.getElementById('subscription-plans');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {currentTier === 'free' ? 'Upgrade Plan' : 'Change Plan'}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center p-3 bg-themeColor-light/10 rounded-lg">
            <div className="text-2xl font-bold text-themeColor">{user?.linkCount || 0}</div>
            <div className="text-sm text-gray-600">Total Links</div>
          </div>
          <div className="text-center p-3 bg-themeColor-light/10 rounded-lg">
            <div className="text-2xl font-bold text-themeColor">{user?.apiCallsToday || 0}</div>
            <div className="text-sm text-gray-600">API Calls Today</div>
          </div>
          <div className="text-center p-3 bg-themeColor-light/10 rounded-lg">
            <div className="text-2xl font-bold text-themeColor">
              {daysUntilExpiry !== null ? Math.max(0, daysUntilExpiry) : '∞'}
            </div>
            <div className="text-sm text-gray-600">Days Left</div>
          </div>
          <div className="text-center p-3 bg-themeColor-light/10 rounded-lg">
            <div className="text-2xl font-bold text-themeColor">
              {subscriptionData?.billingCycle === 'yearly' ? '12' : '1'}
            </div>
            <div className="text-sm text-gray-600">Months Duration</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};