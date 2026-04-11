"use client";

import { RoleGuard } from "@/components";
import { ROLES } from "@/constants";

const ClientsLayout = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard allowedRoles={[ROLES.ADMIN]}>{children}</RoleGuard>;
};

export default ClientsLayout;
