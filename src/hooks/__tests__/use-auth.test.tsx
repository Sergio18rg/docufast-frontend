import { renderHook } from "@testing-library/react";
import { useAuth } from "../use-auth";
import { createAuthWrapper } from "../../__tests__/helpers";

const wrapper = createAuthWrapper();

describe("useAuth", () => {
  it("should throw error when used outside AuthProvider", () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow("useAuth must be used within an AuthProvider");
  });

  it("should return auth context when used inside AuthProvider", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toStrictEqual(true);
    expect(result.current.token).toStrictEqual("test-token");
    expect(result.current.user?.email).toStrictEqual("admin@test.com");
  });
});
