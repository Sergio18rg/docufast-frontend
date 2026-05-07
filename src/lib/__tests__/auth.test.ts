import { saveToken, getToken, removeToken } from "../auth";

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

describe("auth", () => {
  beforeAll(() => {
    Object.defineProperty(globalThis, "localStorage", {
      value: localStorageMock,
      writable: true,
    });
  });

  beforeEach(() => {
    localStorageMock.clear();
  });

  it("should save and retrieve token", () => {
    const token = "test-token-123";
    saveToken(token);
    expect(getToken()).toStrictEqual(token);
  });

  it("should remove token", () => {
    saveToken("test-token");
    removeToken();
    expect(getToken()).toBeNull();
  });
});
