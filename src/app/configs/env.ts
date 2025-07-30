import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().min(2, "PORT is required with minimum digit 2 "),
  MDB_URI: z.string().url("MDB_URI must be a valid MongoDB URL"),
  NODE_ENV: z.enum(["development", "production"]),
  JWT_SECRET: z.string(),
  JWT_EXP_IN: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_REFRESH_EXP: z.string(),
  BCRYPT_SALT: z.string(),
  FRONTEND_URL: z.string(),
});
const parseEnv = envSchema.safeParse(process.env);
if (!parseEnv.success) {
  console.error("Environment variable validation failed:");
  console.error(parseEnv.error.format());
  process.exit(1);
}
const env = {
  ...parseEnv.data,
};
export const envVars = env;
