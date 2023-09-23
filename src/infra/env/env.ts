import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  USER_MAIL: z.string().email(),
  USER_MAIL_PASSWORD: z.string(),
});

export type Env = z.infer<typeof envSchema>;
