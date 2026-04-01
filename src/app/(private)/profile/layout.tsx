"use client";

import { RoleGuard } from "@/components/auth/role-guard";
import { ROLES } from "@/constants";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.WORKER]}>{children}</RoleGuard>
  );
};

export default ProfileLayout;
