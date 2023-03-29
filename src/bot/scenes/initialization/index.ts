import {
  On,
  Ctx,
  Scene,
  SceneEnter,
  SceneLeave,
  Sender,
} from 'nestjs-telegraf';
import { UserService } from 'src/user/user.service';
import { User } from 'telegraf/typings/core/types/typegram';
import { SCENE_ID } from '../../constants/scene.constants';
import { BotService } from '../../bot.service';
import { TEXT } from './text.constants';
import { BotContext } from 'src/bot/types/bot-context.type';

@Scene(SCENE_ID.initialization)
export class InitializationScene {
  constructor(
    private readonly userService: UserService,
    private readonly botService: BotService,
  ) {}

  @SceneEnter()
  async onSceneEnter(
    @Ctx() ctx: BotContext,
    @Sender() user: User,
  ): Promise<void> {
    const newUser = this.botService.transformUserTelegramInUserEntity(
      user,
      true,
    );
    await this.userService.createUser(newUser);
    await ctx.scene.leave();
  }

  @SceneLeave()
  onSceneLeave(): string {
    return TEXT.leave;
  }
}
