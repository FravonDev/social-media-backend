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

interface SendUserEmailConfirmationUseCaseRequest {
  email: string;
}

type SendUserEmailConfirmationUseCaseResponse = Either<
  UserNotFoundError,
  {
    sent: boolean;
  }
>;

@Injectable()
export class SendUserEmailConfirmationUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private emailService: MailService,
    private hashGenerator: HashGenerator,
    private confirmationRepository: ConfirmationRepository,
  ) {}

  async execute({
    email,
  }: SendUserEmailConfirmationUseCaseRequest): Promise<SendUserEmailConfirmationUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      return left(new EmailAlreadyExistsError(email));
    }

    const code = await this.hashGenerator.createPinByEmail(email);

    const data = await this.emailService.sendMail({
      to: email,
      subject: 'Confirm your account',
      html: `<p>Confirm ${code} account</p>`,
    }); //enails in the future will be sent with events, but for now we will use that way

    const expirationInMiliseconds = 1000 * 60 * 5;
    const confirmation = Confirmation.create({
      email,
      code,
      expiresAt: new Date(Date.now() + expirationInMiliseconds),
      createdAt: new Date(),
    });

    await this.confirmationRepository.create(confirmation);

    return right({
      sent: true,
    });
  }
}
