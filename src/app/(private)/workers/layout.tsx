"use client";

import { RoleGuard } from "@/components";
import { ROLES } from "@/constants";

const WorkersLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.EXTERNAL]}>
      {children}
    </RoleGuard>
  );
};

export default WorkersLayout;
