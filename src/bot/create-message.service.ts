import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/user.entity';
import { USER_ROLE } from './constants/role.constants';

@Injectable()
export class CreateMessage {
  emojiYesOrNo(b: boolean): string {
    return b ? '✅' : '❌';
  }

  buildUserResponse(user: UserEntity): string {
    return (
      `├ 👨‍💼${user.firstName}\n` +
      `├ 🆔: ${user.telegramId}\n` +
      `├ Фамилия: ${user.lastName}\n` +
      `├ UserName: ${user.username}\n` +
      `├ Роль: ${USER_ROLE[user.role]}\n` +
      `├ Отправлять сообщения: ${this.emojiYesOrNo(user.isSendMessage)}\n` +
      `├ Активирован: ${this.emojiYesOrNo(user.isActive)}\n` +
      `├ Бан: ${this.emojiYesOrNo(user.isBan)}\n`
    );
  }

  sendLink(link: string): string {
    return `🚴‍♂️ Следи за мной 🚴‍♂️ \n${link}`;
  }
}
