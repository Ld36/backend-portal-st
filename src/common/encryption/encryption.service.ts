import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly ivLength = 16;
  private readonly secret: Buffer;

  constructor(private configService: ConfigService) {
    const key = this.configService.get<string>('SECRET_KEY');

    if (!key || key.length !== 32) {
      throw new Error(
        'SECRET_KEY must exist in .env and have exactly 32 characters.',
      );
    }

    this.secret = Buffer.from(key);
  }

  encrypt(value: string): string {
    const iv = crypto.randomBytes(this.ivLength);

    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.secret,
      iv,
    );

    const encrypted = Buffer.concat([
      cipher.update(value, 'utf8'),
      cipher.final(),
    ]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(value: string): string {
    const [ivHex, encryptedHex] = value.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');

    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.secret,
      iv,
    );

    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }
}