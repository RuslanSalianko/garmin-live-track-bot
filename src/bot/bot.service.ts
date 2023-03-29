import { Injectable } from '@nestjs/common';
import { TelegrafException } from 'nestjs-telegraf';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { EUserRole } from 'src/user/types/user-role.enum';
import { UserService } from 'src/user/user.service';
import { User } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class BotService {
  constructor(private readonly userService: UserService) {}

  transformUserTelegramInUserEntity(
    userTelegram: User,
    isAdmin = false,
    isBan = false,
  ): CreateUserDto {
    return {
      telegramId: userTelegram.id,
      username: userTelegram.username || '',
      firstName: userTelegram.first_name,
      lastName: userTelegram.last_name || '',
      role: isAdmin ? EUserRole.ADMIN : EUserRole.USER,
      isActive: isAdmin ? true : false,
      isBan,
    };
  }

  async verificationUser(telegramId: number): Promise<boolean> {
    try {
      return Boolean(await this.userService.findByTelegramId(telegramId));
    } catch (error) {
      if (error.status === 404) {
        return false;
      }
      throw new TelegrafException(error.message);
    }
  }
}
