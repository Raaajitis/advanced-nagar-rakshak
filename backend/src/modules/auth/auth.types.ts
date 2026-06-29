export interface RegisterUserDTO {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role?: "citizen" | "admin";
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  role: "citizen" | "admin";
}