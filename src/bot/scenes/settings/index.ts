import {
  Action,
  Ctx,
  Hears,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { MENU } from 'src/bot/constants/menu.constants';
import { SCENE_ID } from 'src/bot/constants/scene.constants';
import { CreateMessage } from 'src/bot/create-message.service';
import { InlineMenu } from 'src/bot/menu/inline.menu';
import { KeyboardMenu } from 'src/bot/menu/keyboard.menu';
import { BotContext } from 'src/bot/types/bot-context.type';
import { UserService } from 'src/user/user.service';
import { TEXT } from './text.constants';

@Scene(SCENE_ID.settings)
export class SettingsScene {
  constructor(
    private readonly keyboardMenu: KeyboardMenu,
    private readonly inlineMenu: InlineMenu,
    private readonly userService: UserService,
    private readonly createMessage: CreateMessage,
  ) {}

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: BotContext) {
    await ctx.reply(TEXT.enter, this.keyboardMenu.settings());
  }

  @Hears(MENU.keyboard.settings.users)
  async users(@Ctx() ctx: BotContext) {
    const users = await this.userService.findAll();
    for (const user of users) {
      await ctx.reply(
        this.createMessage.buildUserResponse(user),
        this.inlineMenu.user(user.id, user.isSendMessage, user.isBan),
      );
    }
  }

  @Hears(MENU.keyboard.settings.isActiveUsers)
  async isActive(@Ctx() ctx: BotContext) {
    const users = await this.userService.findAllByIsActive();

    if (users.length === 0) {
      await ctx.reply(TEXT.noIsActiveUsers, this.keyboardMenu.settings());
    }

    for (const user of users) {
      await ctx.reply(
        this.createMessage.buildUserResponse(user),
        this.inlineMenu.userActivation(user.id),
      );
    }
  }

  @Action(/^activation:[0-9]+$/)
  async activation(@Ctx() ctx: BotContext) {
    const cbQuery = ctx.callbackQuery;
    const userId = Number(cbQuery?.['data'].split(':')[1]);

    const user = await this.userService.editActivate(userId, true);

    await ctx.telegram.sendMessage(user.telegramId, TEXT.sendUserActivation);

    await ctx.reply(TEXT.activation);
  }

  @Action(/^ban:[0-9]+$/)
  async ban(@Ctx() ctx: BotContext) {
    const cbQuery = ctx.callbackQuery;
    const userId = Number(cbQuery?.['data'].split(':')[1]);

    const user = await this.userService.editBan(userId, true);
    await ctx.telegram.sendMessage(user.telegramId, TEXT.sendUserNoActivation);
    await ctx.reply(TEXT.sendMessage);
  }

  @Action(/^editSendMessage:[true,false]+:[0-9]+$/)
  async editSendMessage(@Ctx() ctx: BotContext) {
    const [, is, userId] = ctx.callbackQuery?.['data'].split(':');
    const isSendMessage = is === 'true' ? true : false;
    const user = await this.userService.editSendMessage(userId, isSendMessage);
    await ctx.editMessageText(
      this.createMessage.buildUserResponse(user),
      this.inlineMenu.user(user.id, user.isSendMessage, user.isBan),
    );
  }

  @Action(/^editBan:[true,falsei]+:[0-9]+$/)
  async editBan(@Ctx() ctx: BotContext) {
    const [, is, userId] = ctx.callbackQuery?.['data'].split(':');
    const isBan = is === 'true' ? true : false;
    const user = await this.userService.editBan(userId, isBan);

    await ctx.editMessageText(
      this.createMessage.buildUserResponse(user),
      this.inlineMenu.user(user.id, user.isSendMessage, user.isBan),
    );
  }

  @Hears(MENU.back)
  async back(@Ctx() ctx: BotContext) {
    ctx.scene.leave();
  }

  @SceneLeave()
  async onSceneLeave(@Ctx() ctx: BotContext) {
    await ctx.reply(TEXT.leave, this.keyboardMenu.main(ctx.session.isAdmin));
  }
}
