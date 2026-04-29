import { Role } from "@/constants";

interface AuthUser {
  user_id: number;
  email: string;
  role: Role;
  must_change_password?: boolean;
  full_name?: string | null;
  status?: string;
  first_name?: string | null;
  last_name_1?: string | null;
  last_name_2?: string | null;
  document_number?: string | null;
  social_security_number?: string | null;
  birth_date?: string | null;
  address?: string | null;
  phone?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  contract_start_date?: string | null;
  current_vehicle?: {
    vehicle_id: number;
    license_plate: string;
    vehicle_type: string;
    company_owner?: string;
    status?: string;
    contract_start_date?: string | null;
    contract_end_date?: string | null;
    notes?: string | null;
  } | null;
  client?: {
    client_id: number;
    client_code: string;
    business_name: string;
    contact_email?: string | null;
    contact_phone?: string | null;
    badge_color: string;
    contract_start_date?: string | null;
    contract_end_date?: string | null;
    status?: string;
    notes?: string | null;
  } | null;
  documents?: import("./worker.types").WorkerDocument[];
  photo_url?: string | null;
  badge_color?: string;
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
