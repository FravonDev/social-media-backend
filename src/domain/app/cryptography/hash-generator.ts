export abstract class HashGenerator {
  abstract hash(plain: string): Promise<string>;
  abstract createPinByEmail(email: string): Promise<string>;
}
