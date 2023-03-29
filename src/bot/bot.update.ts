import { UseFilters, UseGuards } from '@nestjs/common';
import { Ctx, Hears, On, Sender, Start, Update } from 'nestjs-telegraf';
import { UserService } from 'src/user/user.service';
import { SCENE_ID } from './constants/scene.constants';
import { BotService } from './bot.service';
import { UserGuard } from './guards/user.guard';
import { KeyboardMenu } from './menu/keyboard.menu';
import { BotContext } from './types/bot-context.type';
import { TEXT } from './constants/text.constants';
import { BotExceptionFilter } from './filters/bot-exception.filter';
import { MENU } from './constants/menu.constants';

@Update()
@UseFilters(BotExceptionFilter)
@UseGuards(UserGuard)
export class BotUpdate {
  constructor(
    private readonly userService: UserService,
    private readonly botService: BotService,
    private readonly keyboardMenu: KeyboardMenu,
  ) {}

  @Start()
  async start(@Ctx() ctx: BotContext, @Sender('id') telegramId: number) {
    const countUser = await this.userService.countUsers();
    if (countUser === 0) {
      await ctx.scene.enter(SCENE_ID.initialization);
      return;
    }

    const isRegisteredUser = await this.botService.verificationUser(telegramId);

    if (isRegisteredUser) {
      const isAdmin = await this.userService.isUserAnAdminTelegramId(
        telegramId,
      );
      const mainMenu = this.keyboardMenu.main(isAdmin);
      ctx.session.isAdmin = isAdmin;

      await ctx.reply(TEXT.welcome, mainMenu);
    } else {
      await ctx.scene.enter(SCENE_ID.login);
    }
  }

  @Hears(MENU.keyboard.main.settings)
  async settings(@Ctx() ctx: BotContext) {
    await ctx.scene.enter(SCENE_ID.settings);
  }

  @On('text')
  async restartMenu(@Ctx() ctx: BotContext, @Sender('id') telegramId: number) {
    const isAdmin = await this.userService.isUserAnAdminTelegramId(telegramId);
    const mainMenu = this.keyboardMenu.main(isAdmin);
    ctx.session.isAdmin = isAdmin;
    await ctx.scene.leave();
    await ctx.reply(TEXT.leave, mainMenu);
  }
}
