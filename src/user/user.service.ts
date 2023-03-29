import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EUserRole } from './types/user-role.enum';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async createUser(userDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { telegramId: userDto.telegramId },
    });
    if (user) {
      throw new HttpException(
        'Пользователь существует',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new UserEntity();
    Object.assign(newUser, userDto);

    return this.userRepository.save(newUser);
  }

  async editBan(id: number, isBan: boolean): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    user.isBan = isBan;

    return this.userRepository.save(user);
  }

  async editSendMessage(
    id: number,
    isSendMessage: boolean,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    user.isSendMessage = isSendMessage;

    return this.userRepository.save(user);
  }

  async editActivate(id: number, isActive: boolean): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    user.isActive = isActive;

    return this.userRepository.save(user);
  }

  async isUserAnBanTelegramId(telegramId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { telegramId } });
    if (!user) {
      throw new NotFoundException();
    }
    return user.isBan;
  }

  async countUsers(): Promise<number> {
    return this.userRepository.count();
  }

  async findByTelegramId(telegramId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { telegramId } });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async isUserAnAdminTelegramId(telegramUserId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { telegramId: telegramUserId },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return user.role === EUserRole.ADMIN;
  }

  async findByRoles(roles: EUserRole[]): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: {
        role: In(roles),
      },
    });
  }
  async findBySendMessage(): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: { isSendMessage: true, isBan: false, isActive: true },
    });
  }
  async findAllByIsActive(): Promise<UserEntity[]> {
    return this.userRepository.find({
      where: { isActive: false, isBan: false },
    });
  }
}
