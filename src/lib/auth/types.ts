export interface AuthUser {
  user_id: number;
  full_name: string | null;
  email: string;
  is_active: boolean;
  google_connected: boolean;
  brain_tier?: string;
}

export interface AuthSession {
  access_token: string;
  token_type: string;
  user: AuthUser;
}