/**
 * Authentication & User Profile Type Definitions.
 */

export type UserRole = "admin" | "end_user" | "user";

export interface User {
  user_id: string;
  email: string;
  role: UserRole;
  tenant_id?: string;
  full_name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

export interface LoginResponseData {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
  role: UserRole;
  tenant_id: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}
