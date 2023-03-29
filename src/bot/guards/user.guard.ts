import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TelegrafException, TelegrafExecutionContext } from 'nestjs-telegraf';
import { UserService } from 'src/user/user.service';
import { Context } from 'telegraf';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();
    let isBan: boolean;
    let isActive: boolean;
    try {
      const user = await this.userService.findByTelegramId(from.id);
      isBan = user.isBan;
      isActive = user.isActive;
    } catch (error) {
      if (error.status === 404) {
        return true;
      }
      throw new TelegrafException(error);
    }

    if (isBan) {
      throw new TelegrafException('Доступ запрещен');
    }
    if (!isActive) {
      throw new TelegrafException('Дождитесь когда вас активируют');
    }
    return true;
  }
}
