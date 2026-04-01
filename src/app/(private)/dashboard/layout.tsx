"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { ROLES } from "@/constants";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard allowedRoles={[ROLES.ADMIN]}>{children}</RoleGuard>;
};

export default DashboardLayout;
