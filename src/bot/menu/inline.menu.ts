import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import { InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { MENU } from '../constants/menu.constants';

@Injectable()
export class InlineMenu {
  userActivation(id: number): Markup.Markup<InlineKeyboardMarkup> {
    const { activation, ban } = MENU.inline.userActivation;
    return Markup.inlineKeyboard([
      [
        {
          text: activation,
          callback_data: `activation:${id}`,
        },
        {
          text: ban,
          callback_data: `ban:${id}`,
        },
      ],
    ]);
  }

  user(
    id: number,
    isSendMessage: boolean,
    isBan: boolean,
  ): Markup.Markup<InlineKeyboardMarkup> {
    const { activationSendMessage, removeSendMessage, ban, removeBan } =
      MENU.inline.user;
    return Markup.inlineKeyboard([
      [
        {
          text: isSendMessage ? removeSendMessage : activationSendMessage,
          callback_data: `editSendMessage:${!isSendMessage}:${id}`,
        },
        {
          text: isBan ? removeBan : ban,
          callback_data: `editBan:${!isBan}:${id}`,
        },
      ],
    ]);
  }
}
