"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

export const useAuthRedirect = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return { user, loading };
};
