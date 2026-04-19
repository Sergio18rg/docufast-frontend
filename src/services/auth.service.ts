import { apiRequest, getApiErrorMessage, METHODS, getAuthHeaders } from "./api";
import type {
  ChangePasswordResponse,
  LoginResponse,
  ProfileResponse,
} from "@/types";

const AUTH_URL = "/auth";

const loginRequest = async (email: string, password: string) => {
  try {
    return await apiRequest<LoginResponse>({
      url: `${AUTH_URL}/login`,
      method: METHODS.POST,
      data: { email, password },
    });
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Invalid credentials"));
  }
};

const changePasswordRequest = async (
  token: string,
  newPassword: string,
  confirmPassword: string,
) => {
  try {
    return await apiRequest<ChangePasswordResponse>({
      url: `${AUTH_URL}/change-password`,
      method: METHODS.POST,
      headers: getAuthHeaders(token),
      data: { newPassword, confirmPassword },
    });
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to change password"));
  }
};

const getProfile = async (token: string) => {
  try {
    return await apiRequest<ProfileResponse>({
      url: `${AUTH_URL}/profile`,
      method: METHODS.GET,
      headers: getAuthHeaders(token),
    });
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unauthorized"));
  }
};

export { loginRequest, changePasswordRequest, getProfile };
