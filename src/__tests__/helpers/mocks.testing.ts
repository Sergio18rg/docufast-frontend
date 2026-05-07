import type { AuthUser } from "@/types";

const createMockUser = (overrides?: Partial<AuthUser>): AuthUser => ({
  user_id: 1,
  email: "admin@test.com",
  role: "Administrator",
  ...overrides,
});

const createMockAuthValue = (overrides?: {
  user?: AuthUser;
  token?: string;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}) => ({
  user: overrides?.user ?? createMockUser(),
  token: overrides?.token ?? "test-token",
  isAuthenticated: overrides?.isAuthenticated ?? true,
  isLoading: overrides?.isLoading ?? false,
  login: jest.fn(),
  logout: jest.fn(),
  refreshProfile: jest.fn(),
});

export { createMockUser, createMockAuthValue };
