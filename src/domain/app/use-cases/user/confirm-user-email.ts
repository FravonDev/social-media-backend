import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/domain/app/repositories/users-repository';
import { UserSummary } from '@/domain/app/entities/user';
import { UserNotFoundError } from '@/core/errors/shared/user-not-found';
import { EmailAlreadyExistsError } from './errors/email-already-exists';
import { MailService } from '@/infra/mail/mail.service';
import { HashGenerator } from '../../cryptography/hash-generator';
import { Confirmation } from '../../entities/confirmation';
import { ConfirmationRepository } from '../../repositories/confirmation-repository';
import { ResourceNotFoundError } from '@/core/errors/shared/resource-not-found';
import { CodeExpiredError } from './errors/code-expired-error';

interface ConfirmUserEmailUseCaseRequest {
  email: string;
  code: string;
}

type ConfirmUserEmailUseCaseResponse = Either<
  ResourceNotFoundError | CodeExpiredError,
  {
    confirmed: boolean;
  }
>;

@Injectable()
export class ConfirmUserEmailUseCase {
  constructor(private confirmationRepository: ConfirmationRepository) {}

  async execute({
    email,
    code,
  }: ConfirmUserEmailUseCaseRequest): Promise<ConfirmUserEmailUseCaseResponse> {
    const confirmationCodeExists =
      await this.confirmationRepository.findByEmailAndCode(email, code);

    if (!confirmationCodeExists) {
      return left(new ResourceNotFoundError());
    }

    const expired = confirmationCodeExists.isExpired();

    if (expired) {
      return left(new CodeExpiredError());
    }

    if (confirmationCodeExists.confirmedAt) {
      return right({
        confirmed: true,
      });
    }

    confirmationCodeExists.confirm();

    await this.confirmationRepository.save(confirmationCodeExists);

    return right({
      confirmed: true,
    });
  }
}
