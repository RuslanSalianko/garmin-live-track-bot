import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const getTypeormConfig = (
  configService: ConfigService,
): DataSourceOptions => {
  const type =
    configService.get<'postgres' | 'mysql' | 'mariadb'>('DB_DIALECT') ||
    'postgres';
  const host = configService.get<string>('DB_HOST') || 'localhost';
  const port = configService.get<number>('DB_PORT') || 5432;
  const username = configService.get<string>('DB_USER_NAME');
  const password = configService.get<string>('DB_PASSWORD');
  const database = configService.get<string>('DB_DATABASE');

  if (!(username && password && database)) {
    throw new Error('No config typeorm');
  }

  return {
    type,
    host,
    port,
    username,
    password,
    database,
    synchronize: false,
    entities: [__dirname + '/../**/*.entity.{ts,js}'],
    migrations: [__dirname + '/migrations/*.{ts,js}'],
  };
};
