import { IsNotEmpty } from 'class-validator';
import { EUserRole } from '../types/user-role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  readonly telegramId: number;
  readonly username: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: EUserRole;
  readonly isActive?: boolean;
  readonly isSendMessage?: boolean;
  readonly isBan?: boolean;
}
