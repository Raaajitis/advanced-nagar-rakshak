import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must contain at least 3 characters"),

    email: z
      .string()
      .email("Invalid email"),

    phone: z
      .string()
      .min(10, "Phone number should contain at least 10 digits"),

    password: z
      .string()
      .min(6, "Password should contain at least 6 characters"),

    confirmPassword: z.string(),

    role: z.enum(["citizen", "admin"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(6, "Password should contain at least 6 characters"),
});