export interface RegisterPayload {
  full_name: string
  email: string
  phone: string
  password: string
  role?: 'student' | 'admin'
}

export interface LoginPayload {
  email: string
  password: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string | number
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  email: string
  otp: string | number
  newPassword: string
}

export interface AuthPerson {
  full_name: string
  email: string
  refreshToken: string
}

export interface VerifyOtpResponse {
  message: string
  data: string        
  person: AuthPerson
}

export interface RefreshTokenResponse {
  accessToken: string
}

export interface MessageResponse {
  message: string
}