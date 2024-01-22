import { Confirmation } from '@/domain/app/entities/confirmation';
import { Follow } from '@/domain/app/entities/follow';
import { ConfirmationRepository } from '@/domain/app/repositories/confirmation-repository';

export class InMemoryConfirmationRepository implements ConfirmationRepository {
  confirmations: Confirmation[] = [];

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
