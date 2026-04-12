import { apiRequest, getApiErrorMessage, METHODS } from "./api";

const AUTH_URL = "/auth";

const loginRequest = async (email: string, password: string) => {
  try {
    return await apiRequest<{ data: { accessToken: string; user: unknown } }>({
      url: `${AUTH_URL}/login`,
      method: METHODS.POST,
      data: {
        email,
        password,
      },
    });
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Invalid credentials"));
  }
};

const getProfile = async (token: string) => {
  try {
    return await apiRequest({
      url: `${AUTH_URL}/profile`,
      method: METHODS.GET,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unauthorized"));
  }
};

export { loginRequest, getProfile };
