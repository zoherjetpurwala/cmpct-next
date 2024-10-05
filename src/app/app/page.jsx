"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner";

const AppHomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      router.push("/app/dashboard");
    }, 1000);
  }, [router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return null;
};

export default AppHomePage;
