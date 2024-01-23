import { Confirmation } from '../entities/confirmation';

export abstract class ConfirmationRepository {
  abstract create(confirmation: Confirmation): Promise<void>;
  abstract save(confirmation: Confirmation): Promise<void>;
  abstract findByEmailAndCode(
    email: string,
    code: string,
  ): Promise<Confirmation | null>;
}
