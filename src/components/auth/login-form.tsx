"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn, getDefaultRouteByRole } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginRequest } from "@/services/auth.service";
import { useAuth } from "@/hooks";
import { t } from "@/lib/t";

export const LoginForm = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@docufast.com");
  const [password, setPassword] = useState("Admin1234!");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await loginRequest(email, password);
      const token = response.data.token;
      const role = response.data.user.role.name;

      await login(token);
      router.replace(getDefaultRouteByRole(role));
    } catch (error) {
      console.error(error);
      setErrorMessage(t("components.auth.loginForm.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

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
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">
                  {t("components.auth.loginForm.username")}
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("components.auth.loginForm.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  {t("components.auth.loginForm.password")}
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>

              {errorMessage ? (
                <p className="text-sm font-medium text-red-600">
                  {errorMessage}
                </p>
              ) : null}

              <Field>
                <div className="flex justify-end">
                  <Button type="submit" className="px-6" disabled={loading}>
                    {loading
                      ? t("components.auth.loginForm.loading")
                      : t("common.login")}
                  </Button>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
