import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { SettingModule } from 'src/setting/setting.module';
import { UserModule } from 'src/user/user.module';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { CreateMessage } from './create-message.service';
import { MailService } from './mail.service';
import { InlineMenu } from './menu/inline.menu';
import { KeyboardMenu } from './menu/keyboard.menu';
import { MessageService } from './message.service';
import { sessionMiddleware } from './middlewares/session.middleware';
import { scenes } from './scenes';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        middlewares: [sessionMiddleware],
        token: configService.get<string>('TELEGRAM_BOT_TOKEN'),
        launchOptions: {
          webhook: {
            domain: configService.get<string>('TELEGRAM_WEBHOOK_DOMAIN'),
            hookPath: configService.get<string>('TELEGRAM_SECRET_PATH'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    UserModule,
    SettingModule,
  ],
  providers: [
    BotService,
    MessageService,
    MailService,
    CreateMessage,
    BotUpdate,
    KeyboardMenu,
    InlineMenu,
    ...scenes,
  ],
})
export class BotModule {}
