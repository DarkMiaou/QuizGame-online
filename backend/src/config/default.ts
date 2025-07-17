import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT ?? '3000', 10),
  env: process.env.NODE_ENV ?? 'development',
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
};

export type Config = {
  port: number;
  env: 'development' | 'production' | string;
  origin: string;
};

export default config;
