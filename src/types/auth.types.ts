import { Role } from "@/constants";

interface AuthUser {
  user_id: number;
  email: string;
  role: Role;
  must_change_password?: boolean;
}

interface LoginUser {
  user_id: number;
  email: string;
  full_name: string;
  status: string;
  must_change_password: boolean;
  role: {
    role_id: number;
    name: Role;
  };
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: LoginUser;
  };
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: LoginUser;
  };
}

export type {
  AuthUser,
  LoginUser,
  LoginResponse,
  ProfileResponse,
  ChangePasswordResponse,
};
