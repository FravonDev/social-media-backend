import { HashComparer } from '@/domain/app/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/app/cryptography/hash-generator';
import { randomInt } from 'crypto';

export class FakeHasher implements HashGenerator, HashComparer {
  createPinByEmail(email: string): Promise<string> {
    const code = randomInt(0, 999999).toString().slice(0, 6);
    return Promise.resolve(code);
  }

  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed');
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash;
  }
}
