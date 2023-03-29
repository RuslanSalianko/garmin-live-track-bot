import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
import { MENU } from '../constants/menu.constants';

@Injectable()
export class KeyboardMenu {
  main(isAdmin: boolean): Markup.Markup<ReplyKeyboardMarkup> {
    const menu = [];
    if (isAdmin) {
      menu.push([MENU.keyboard.main.settings]);
    }

    return Markup.keyboard(menu).oneTime().resize();
  }

  settings(): Markup.Markup<ReplyKeyboardMarkup> {
    const { users, isActiveUsers } = MENU.keyboard.settings;
    const menu = [[users, isActiveUsers], [MENU.back]];

    return Markup.keyboard(menu).oneTime().resize();
  }
}
