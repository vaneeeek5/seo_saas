import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface EncryptedData {
  encryptedKey: string;
  iv: string;
  authTag: string;
  maskedKey: string;
}

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  // Secret key used for symmetric encryption (derived or padded to 32 bytes)
  private readonly secretKey: Buffer;

  constructor() {
    const rawSecret = process.env.ENCRYPTION_SECRET || 'seo-saas-master-military-grade-secret-key-32-bytes!';
    this.secretKey = crypto.createHash('sha256').update(rawSecret).digest();
  }

  encrypt(plaintextKey: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, iv);

    let encrypted = cipher.update(plaintextKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');
    const maskedKey = this.maskKey(plaintextKey);

    return {
      encryptedKey: encrypted,
      iv: iv.toString('hex'),
      authTag,
      maskedKey,
    };
  }

  decrypt(encryptedKey: string, ivHex: string, authTagHex: string): string {
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, iv);

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  maskKey(plaintextKey: string): string {
    if (!plaintextKey || plaintextKey.length < 8) {
      return '****';
    }
    const start = plaintextKey.slice(0, 4);
    const end = plaintextKey.slice(-4);
    return `${start}-****-****-${end}`;
  }
}
