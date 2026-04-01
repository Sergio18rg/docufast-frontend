"use client";

import { PublicHeader } from "@/components/layout/public-header";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main>{children}</main>
    </div>
  );
};

export default PublicLayout;
