import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EUserRole } from './types/user-role.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  telegramId: number;

  @Column()
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: EUserRole,
    default: null,
  })
  role: EUserRole;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    default: true,
  })
  isSendMessage: boolean;

  @Column({ default: false })
  isBan: boolean;
}
