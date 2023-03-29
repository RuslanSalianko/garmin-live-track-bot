import { Ctx, Scene, SceneEnter, SceneLeave, Sender } from 'nestjs-telegraf';
import { BotService } from 'src/bot/bot.service';
import { CreateMessage } from 'src/bot/create-message.service';
import { MessageService } from 'src/bot/message.service';
import { BotContext } from 'src/bot/types/bot-context.type';
import { UserService } from 'src/user/user.service';
import { User } from 'telegraf/typings/core/types/typegram';
import { SCENE_ID } from '../../constants/scene.constants';
import { TEXT } from './text.constants';

@Scene(SCENE_ID.login)
export class LoginScene {
  constructor(
    private readonly botService: BotService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly createMessage: CreateMessage,
  ) {}

  @SceneEnter()
  async onSceneEnteri(@Ctx() ctx: BotContext, @Sender() user: User) {
    const createUser = this.botService.transformUserTelegramInUserEntity(
      user,
      false,
      false,
    );
    const newUser = await this.userService.createUser(createUser);
    await this.messageService.admins(
      `${TEXT.newUser}\n ${this.createMessage.buildUserResponse(newUser)}`,
    );
    await ctx.scene.leave();
  }

  @SceneLeave()
  onSceneLeave(@Ctx() ctx: BotContext): string {
    if (ctx.session.isBan) {
      return TEXT.ban;
    }

    return TEXT.leave;
  }
}
