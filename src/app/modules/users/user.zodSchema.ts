import z from "zod";

export const createUserZodSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, { message: "Name too short!" }),
  email: z.email("Invalid email address"),
  password: z
    .string({ error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/(?=.*[a-z])/, { message: "At least one lowercase letter" })
    .regex(/(?=.*[A-Z])/, { message: "At least one uppercase letter" })
    .regex(/(?=.*\d)/, { message: "At least one digit" })
    .regex(/(?=.*[^A-Za-z\d])/, {
      message: "At least one special character (non-letter, non-digit)",
    }),
  phone: z.string().optional(),
  photo: z.string().optional(),
  address: z.string().optional(),
});
