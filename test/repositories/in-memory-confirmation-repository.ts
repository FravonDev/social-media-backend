import { Confirmation } from '@/domain/app/entities/confirmation';
import { ConfirmationRepository } from '@/domain/app/repositories/confirmation-repository';

export class InMemoryConfirmationRepository implements ConfirmationRepository {
  confirmations: Confirmation[] = [];

  findByEmailAndCode(
    email: string,
    code: string,
  ): Promise<Confirmation | null> {
    const confirmation = this.confirmations.find(
      (item) => item.email === email && item.code === code,
    );
    if (!confirmation) {
      return Promise.resolve(null);
    }
    return Promise.resolve(confirmation);
  }

  async save(confirmation: Confirmation): Promise<void> {
    const index = this.confirmations.findIndex(
      (item) => item.id === confirmation.id,
    );
    this.confirmations[index] = confirmation;
  }

  async create(follow: Confirmation): Promise<void> {
    await this.confirmations.push(follow);
  }
}
