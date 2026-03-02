import { ValueTransformer } from 'typeorm';
import * as crypto from 'crypto';

export class EncryptionTransformer implements ValueTransformer {
  private readonly algorithm = 'aes-256-cbc';
  private readonly ivLength = 16;
  
  private getSecret(): Buffer {
    const key = process.env.SECRET_KEY;
    if (!key || key.length !== 32) {
      throw new Error('SECRET_KEY must exist in .env and have exactly 32 characters.');
    }
    return Buffer.from(key);
  }

  to(value: string | null): string | null {
    if (!value) return value;
    
    const secret = this.getSecret();
    const iv = crypto.randomBytes(this.ivLength);
    
    const cipher = crypto.createCipheriv(this.algorithm, secret, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(value, 'utf8'),
      cipher.final(),
    ]);
    
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  from(value: string | null): string | null {
    if (!value) return value;
    
    if (!value.includes(':')) {
      return value; 
    }
    
    const secret = this.getSecret();
    const parts = value.split(':');
    
    if (parts.length !== 2) {
      return value; 
    }
    
    const [ivHex, encryptedHex] = parts;
    
    try {
      const iv = Buffer.from(ivHex, 'hex');
      const encryptedText = Buffer.from(encryptedHex, 'hex');
      
      const decipher = crypto.createDecipheriv(this.algorithm, secret, iv);
      
      const decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
      ]);
      
      return decrypted.toString('utf8');
    } catch (error) {
      console.error('Erro ao descriptografar:', error);
      return value; 
    }
  }
}
