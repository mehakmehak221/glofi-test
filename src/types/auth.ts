export interface SendRegistrationOtpBody {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  referralCode?: string;
}

export interface RegistrationOtpBody {
  email: string;
  otp: string;
}

export interface SendPhoneOtpBody {
  email: string;
  phone: string;
}

export interface SendPhoneOtpResponse {
  success?: boolean;
  hasPendingRegistration?: boolean;
  phone?: string;
  message?: string;
}

export interface VerifyPhoneOtpBody {
  email: string;
  firebaseIdToken: string;
}
