"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn, getDefaultRouteByRole } from "@/lib/utils";
import { Role } from "@/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CustomButton,
  CustomInput,
} from "@/components";
import { loginRequest } from "@/services";
import { useAuth } from "@/hooks";
import { t } from "@/lib/t";
import { PasswordChangeForm } from "./password-change-form";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("yourEmail@docufast.com");
  const [password, setPassword] = useState("");
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await loginRequest(email, password);
      const token = response.data.token;
      const role = response.data.user.role.name;
      const mustChangePassword = response.data.user.must_change_password;

      if (mustChangePassword) {
        setPendingToken(token);
        setPendingRole(role);
        return;
      }

      await login(token);
      router.replace(getDefaultRouteByRole(role as Role));
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("components.auth.loginForm.invalidCredentials"),
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeSuccess = async (token: string, role: string) => {
    setPendingToken(null);
    setPendingRole(null);
    await login(token);
    router.replace(getDefaultRouteByRole(role as Role));
  };

  if (pendingToken && pendingRole) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <PasswordChangeForm
          token={pendingToken}
          onSuccess={handlePasswordChangeSuccess}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-3xl">
            {t("components.auth.loginForm.title")}
          </CardTitle>
          <CardDescription>
            {t("components.auth.loginForm.description")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <CustomInput
              id="email"
              label={t("components.auth.loginForm.username")}
              type="email"
              placeholder={t("components.auth.loginForm.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <CustomInput
              id="password"
              label={t("components.auth.loginForm.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {errorMessage && (
              <p className="text-sm font-medium text-red-600">{errorMessage}</p>
            )}

            <div className="flex justify-end">
              <CustomButton
                type="submit"
                text={
                  loading
                    ? t("components.auth.loginForm.loading")
                    : t("common.login")
                }
                disabled={loading}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
