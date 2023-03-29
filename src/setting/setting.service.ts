import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { SettingEntity } from './setting.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingRepository: Repository<SettingEntity>,
  ) {}

  async savePassword(password: string): Promise<SettingEntity> {
    const passwordDb = await this.settingRepository.findOne({
      where: { name: 'password' },
    });

    if (passwordDb) {
      throw new HttpException(
        'Пароль существует',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newPassword = new SettingEntity();
    const hashPassword = await hash(password, 12);
    Object.assign(newPassword, { name: 'password', value: hashPassword });

    return this.settingRepository.save(newPassword);
  }

  async verificationPassword(password: string): Promise<boolean> {
    const passwordDb = await this.settingRepository.findOne({
      where: { name: 'password' },
    });

    return compare(password, passwordDb.value);
  }
}
