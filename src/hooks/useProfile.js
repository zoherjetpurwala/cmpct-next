import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useProfile = () => {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  }, [status, router, session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsUpdating(true);
    try {
      // TODO: Replace with actual API call to update profile
      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          ...(formData.newPassword && { password: formData.newPassword })
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Refresh the session to get updated user data
      await update();
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        newPassword: "",
        confirmPassword: ""
      }));
      
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const refreshSession = async () => {
    setIsRefreshing(true);
    try {
      await update();
      toast.success("Profile refreshed!");
    } catch (error) {
      console.error('Session refresh error:', error);
      toast.error("Failed to refresh profile");
    } finally {
      setIsRefreshing(false);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: session?.user?.phone || "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return {
    session,
    status,
    isEditing,
    setIsEditing,
    formData,
    isUpdating,
    isRefreshing,
    handleInputChange,
    handleUpdateProfile,
    refreshSession,
    cancelEditing
  };
};