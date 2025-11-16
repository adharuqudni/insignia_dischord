import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import path from 'path';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'discord_scheduler',
  synchronize: false, // Never use true in production
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, '../models/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/**/*.{ts,js}')],
  subscribers: [],
});

