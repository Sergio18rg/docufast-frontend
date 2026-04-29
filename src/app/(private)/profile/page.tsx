"use client";

import { Title } from "@/components";
import { useAuth } from "@/hooks";
import { DocumentsSummary, ProfileData } from "./components";

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Title
        title="Profile"
        description="Personal information and visible documents for your account."
      />

      <ProfileData user={user} />
      <DocumentsSummary documents={user.documents ?? []} />
    </div>
  );
};

export default ProfilePage;
