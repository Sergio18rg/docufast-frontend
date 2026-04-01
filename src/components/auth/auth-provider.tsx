"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProfile } from "@/services/auth.service";
import { getToken, removeToken, saveToken } from "@/lib/auth";
import type { AuthUser } from "@/types/auth.types";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthState = () => {
    setUser(null);
    setToken(null);
  };

  const refreshProfile = useCallback(async () => {
    const storedToken = getToken();

    if (!storedToken) {
      clearAuthState();
      setIsLoading(false);
      return;
    }

    try {
      const response = await getProfile(storedToken);
      setToken(storedToken);
      setUser(response.data);
    } catch {
      removeToken();
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const login = useCallback(
    async (newToken: string) => {
      saveToken(newToken);
      setToken(newToken);
      setIsLoading(true);
      await refreshProfile();
    },
    [refreshProfile],
  );

  const logout = useCallback(() => {
    removeToken();
    clearAuthState();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      logout,
      refreshProfile,
    }),
    [user, token, isLoading, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
