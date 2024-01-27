import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface ConfirmationProps {
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
  confirmedAt?: Date;
}

export class Confirmation extends Entity<ConfirmationProps> {
  get email(): string {
    return this.props.email;
  }

  get code(): string {
    return this.props.code;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get confirmedAt(): Date | undefined {
    return this.props.confirmedAt;
  }

  confirm(): void {
    this.props.confirmedAt = new Date();
  }

  isExpired(): boolean {
    return this.props.expiresAt.getTime() < Date.now();
  }

  public static create(
    props: ConfirmationProps,
    id?: UniqueEntityID,
  ): Confirmation {
    const confirmation = new Confirmation(props, id);

    return confirmation;
  }
}
