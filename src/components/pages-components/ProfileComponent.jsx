"use client";

import { motion } from "framer-motion";
import LoadingSpinner from "../common/LoadingComponent";
import { useProfile } from "../../hooks/useProfile";
import { UserInfoCard } from "../profile-components/UserInfoCard";
import { SubscriptionCard } from "../profile-components/SubscriptionCard";

export default function ProfileComponent() {
  const {
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
  } = useProfile();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!session?.user) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* User Information Card */}
      <motion.div variants={itemVariants}>
        <UserInfoCard
          session={session}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          formData={formData}
          isUpdating={isUpdating}
          isRefreshing={isRefreshing}
          handleInputChange={handleInputChange}
          handleUpdateProfile={handleUpdateProfile}
          refreshSession={refreshSession}
          cancelEditing={cancelEditing}
        />
      </motion.div>

      {/* Subscription Plans Card */}
      <motion.div variants={itemVariants}>
        <SubscriptionCard 
          user={session.user} 
          refreshSession={refreshSession}
        />
      </motion.div>
    </motion.div>
  );
}