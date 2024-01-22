import { HashComparer } from '@/domain/app/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/app/cryptography/hash-generator';
import { compare, hash } from 'bcrypt';
import { createHash } from 'node:crypto';

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }

  createPinByEmail(email: string): Promise<string> {
    const timestampedEmail = email + Date.now().toString();

    const hashedEmail = createHash('sha256')
      .update(timestampedEmail)
      .digest('hex');

    const sixDigitSubstring = hashedEmail.slice(0, 6);

    const numericCode = parseInt(sixDigitSubstring, 16);

    const sixDigitCode = String(numericCode).slice(-6);

    return Promise.resolve(sixDigitCode);
  }
}
