"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { getDefaultRouteByRole } from "@/lib/utils";
import { LoginForm } from "./components/login-form";

const LoginPage = () => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(getDefaultRouteByRole(user.role));
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f4f4]">
        <p className="text-slate-600">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start pt-16">
      <div className="mt-10 w-full max-w-md px-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
