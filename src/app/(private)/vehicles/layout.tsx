"use client";

import { RoleGuard } from "@/components";
import { ROLES } from "@/constants";

const VehiclesLayout = ({ children }: { children: React.ReactNode }) => {
  return <RoleGuard allowedRoles={[ROLES.ADMIN]}>{children}</RoleGuard>;
};

export default VehiclesLayout;
