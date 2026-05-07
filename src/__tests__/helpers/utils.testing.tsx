import { type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { AuthContext } from "@/components/auth/auth-provider";
import { createMockAuthValue } from "./mocks.testing";

const createAuthWrapper = (authValue = createMockAuthValue()) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
  return wrapper;
};

const renderWithAuth = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    authValue?: ReturnType<typeof createMockAuthValue>;
  },
) => {
  const { authValue, ...renderOptions } = options ?? {};
  const wrapper = createAuthWrapper(authValue);
  return render(ui, { wrapper, ...renderOptions });
};

const createSuccessResponse = <T,>(data: T[] = []) => ({
  data,
  message: "Success",
});

const setupMocksBeforeEach = (...mocks: jest.Mock[]) => {
  beforeEach(() => {
    jest.clearAllMocks();
    mocks.forEach((mock) => {
      mock.mockResolvedValue(createSuccessResponse());
    });
  });
};

export { createAuthWrapper, setupMocksBeforeEach, renderWithAuth };
