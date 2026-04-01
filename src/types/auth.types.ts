import { Role } from "@/constants";

interface AuthUser {
  user_id: number;
  email: string;
  role: Role;
}

interface LoginUser {
  user_id: number;
  email: string;
  full_name: string;
  status: string;
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

export type { AuthUser, LoginUser, LoginResponse, ProfileResponse };
