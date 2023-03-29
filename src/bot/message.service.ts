import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectBot } from 'nestjs-telegraf';
import { EUserRole } from 'src/user/types/user-role.enum';
import { UserService } from 'src/user/user.service';
import { Telegraf } from 'telegraf';
import { CreateMessage } from './create-message.service';
import { MailService } from './mail.service';
import { BotContext } from './types/bot-context.type';

@Injectable()
export class MessageService {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf<BotContext>,
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly createMessage: CreateMessage,
  ) {}

  async admins(message: string): Promise<void> {
    const users = await this.userService.findByRoles([EUserRole.ADMIN]);

    for (const user of users) {
      await this.bot.telegram.sendMessage(user.telegramId, message);
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async pushLinks(): Promise<void> {
    const links = await this.mailService.fechLinksLiveTrack();
    const userSend = await this.userService.findBySendMessage();
    userSend.forEach(async ({ telegramId }) => {
      links.forEach(async (link) => {
        await this.bot.telegram.sendMessage(
          telegramId,
          this.createMessage.sendLink(link),
        );
      });
    });
  }
}
