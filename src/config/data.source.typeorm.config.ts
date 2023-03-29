import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const config: DataSource = new DataSource({
  type: process.env.DB_DIALECT as 'mysql' | 'mariadb' | 'postgres' | 'sqlite',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  entities: ['./src/**/*.entity{.ts,.js}'],
  migrations: ['./src/migrations/**/*{.ts,.js}'],
});
