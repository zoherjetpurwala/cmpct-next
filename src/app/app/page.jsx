"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSession } from "next-auth/react";

const AppHomePage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession(); // Use NextAuth session

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div><LoadingSpinner/></div>;
  }


  // useEffect(() => {
  //   setTimeout(() => {
  //     router.push("/app/dashboard");
  //   }, 1000);
  // }, [router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return null;
};

export default AppHomePage;
