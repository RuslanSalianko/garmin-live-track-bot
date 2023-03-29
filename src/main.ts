import { NestFactory } from '@nestjs/core';
import { getBotToken } from 'nestjs-telegraf';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bot = app.get(getBotToken());

  app.use(bot.webhookCallback(process.env.TELEGRAM_SECRET_PATH));
  await app.listen(5000);
}
bootstrap();
