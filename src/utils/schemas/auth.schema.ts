import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(4).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(4).max(12),
});

export type RegisterSchemaDTO = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export type LoginSchemaDTO = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export type ForgotPasswordSchemaDTO = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export type ResetPasswordSchemaDTO = z.infer<typeof resetPasswordSchema>;
