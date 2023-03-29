import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { SessionContext } from 'telegraf/typings/session';

export type BotContext = Context &
  SceneContext &
  SessionContext<{
    isBan: boolean;
    isAdmin: boolean;
    countInvalidPassword: number;
  }>;
