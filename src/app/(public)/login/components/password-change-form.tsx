"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CustomInput,
  CustomButton,
} from "@/components";
import { changePasswordRequest } from "@/services";

interface PasswordChangeFormProps {
  token: string;
  onSuccess: (token: string, role: string) => void;
}

export const PasswordChangeForm = ({
  token,
  onSuccess,
}: PasswordChangeFormProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await changePasswordRequest(
        token,
        newPassword,
        confirmPassword,
      );
      const newToken = response.data.token;
      const userRole = response.data.user.role.name;
      onSuccess(newToken, userRole);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to change password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-3xl">Change password</CardTitle>
        <CardDescription>
          You must change your temporary password before accessing the system.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CustomInput
            id="newPassword"
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <CustomInput
            id="confirmPassword"
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {errorMessage && (
            <p className="text-sm font-medium text-red-600">{errorMessage}</p>
          )}

          <div className="flex justify-end">
            <CustomButton
              type="submit"
              text={loading ? "Updating..." : "Save password"}
              disabled={loading}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
