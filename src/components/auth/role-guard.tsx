"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import { getDefaultRouteByRole } from "@/lib/utils";
import { ROUTES, Role } from "@/constants";

type RoleGuardProps = {
  allowedRoles: Role[];
  children: React.ReactNode;
};

export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace(ROUTES.public.login);
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace(getDefaultRouteByRole(user.role, ROUTES.public.login));
    }
  }, [allowedRoles, isAuthenticated, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  if (!allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
};
