import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import imaps from 'imap-simple';
import { find } from 'lodash';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}

  async fechLinksLiveTrack(): Promise<string[]> {
    const uids: number[] = [];
    const links: string[] = [];
    const config = {
      imap: {
        user: this.configService.get<string>('MAIL_USER'),
        password: this.configService.get<string>('MAIL_PASSWORD'),
        host: this.configService.get<string>('MAIL_IMAP_HOST'),
        port: this.configService.get<number>('MAIL_IMAP_PORT'),
        tls: true,
      },
    };
    try {
      const connection = await imaps.connect(config);
      await connection.openBox('Garmin');
      const searchCriteria = ['UNSEEN'];
      const fetchOptions = {
        bodies: ['HEADER', 'TEXT'],
        markSeen: false,
      };
      const message = await connection.search(searchCriteria, fetchOptions);
      message.forEach((item) => {
        const text = find(item.parts, { which: 'TEXT' });
        uids.push(item.attributes.uid);
        const html = text.body.replace(/=\r?\n|\r/gi, '');
        const regex =
          /(https:\/\/livetrack\.garmin\.com\/session\/[A-Za-z0-9-]+\/token\/[A-Z0-9]+)/gm;
        const m = regex.exec(html);
        if (m) {
          links.push(m[1]);
        }
      });

      uids.forEach(async (uid) => {
        connection.deleteMessage(uid);
      });

      connection.end();
    } catch (error) {
      Logger.error(error);
    }
    return links;
  }
}
