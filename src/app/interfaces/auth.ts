export interface AuthForm {
  userName: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignupResponse {
  message: string;
}
