import { apiRequest, getAuthHeaders, METHODS } from "./api";
import type {
  ChangePasswordResponse,
  LoginResponse,
  ProfileResponse,
} from "@/types";

const AUTH_URL = "/auth";

const loginRequest = async (email: string, password: string) =>
  apiRequest<LoginResponse>({
    url: `${AUTH_URL}/login`,
    method: METHODS.POST,
    data: { email, password },
  });

const changePasswordRequest = async (
  token: string,
  newPassword: string,
  confirmPassword: string,
) =>
  apiRequest<ChangePasswordResponse>({
    url: `${AUTH_URL}/change-password`,
    method: METHODS.POST,
    headers: getAuthHeaders(token),
    data: { newPassword, confirmPassword },
  });

const getProfile = async (token: string) =>
  apiRequest<ProfileResponse>({
    url: `${AUTH_URL}/profile`,
    method: METHODS.GET,
    headers: getAuthHeaders(token),
  });

export { loginRequest, changePasswordRequest, getProfile };
