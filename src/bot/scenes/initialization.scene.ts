import {
  On,
  Ctx,
  Message,
  Scene,
  SceneEnter,
  SceneLeave,
  Sender,
} from 'nestjs-telegraf';
import { SettingService } from 'src/setting/setting.service';
import { UserService } from 'src/user/user.service';
import { User } from 'telegraf/typings/core/types/typegram';
import { SceneContext } from 'telegraf/typings/scenes';
import { SCENE_ID } from '../bot.constants';
import { BotService } from '../bot.service';

@Scene(SCENE_ID.initialization)
export class InitializationScene {
  constructor(
    private readonly userService: UserService,
    private readonly settingService: SettingService,
    private readonly botService: BotService,
  ) {}

  @SceneEnter()
  onSceneEnter(): string {
    return 'Добрый день.\nНачинается настройка бота.\nВведите пароль к боту:';
  }

  @On('text')
  async savePassword(
    @Ctx() ctx: SceneContext,
    @Message('text') password: string,
    @Sender() user: User,
  ) {
    const newUser = this.botService.transformUserTelegramInUserEntity(
      user,
      true,
    );
    await this.userService.createUser(newUser);
    await this.settingService.savePassword(password);
    await ctx.scene.leave();
  }

  @SceneLeave()
  onSceneLeave(): string {
    return 'Настройка закончена. Вы назначены администратором бота';
  }
}
