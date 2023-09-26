import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsernameAlreadyExistsError } from './errors/username-already-exists';
import { User } from '@/app/entities/user';
import { UsersRepository } from '@/app/repositories/users-repository';
import { EmailAlreadyExistsError } from './errors/email-already-exists';
import { HashGenerator } from '@/app/cryptography/hash-generator';
import { MailService } from '@/infra/mail/mail.service';
import { EnvService } from '@/infra/env/env.service';

export interface CreateUserUseCaseRequest {
  email: string;
  password: string;
  username: string;
  name: string;
  photo: string | null;
  bio: string | null;
}

type CreateUserUseCaseResponse = Either<
  EmailAlreadyExistsError | UsernameAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    private UsersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
    private mailService: MailService,
    private envService: EnvService,
  ) {}
  async execute({
    email,
    password,
    username,
    name,
    photo,
    bio,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithsameEmail = await this.UsersRepository.findByEmail(email);

    if (userWithsameEmail) {
      return left(new EmailAlreadyExistsError(email));
    }

    const userWithsameUsername = await this.UsersRepository.findByUsername(
      username,
    );

    if (userWithsameUsername) {
      return left(new UsernameAlreadyExistsError(username));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      email,
      password: hashedPassword,
      username,
      name,
      photo,
      bio,
      createdAt: new Date(),
      emailVerifiedAt: null,
    });

    await this.UsersRepository.create(user);

    const token = user.token;

    await this.mailService.sendMail({
      to: email,
      subject: 'Social Media - Confirm your email',
      template: 'user-created',
      context: {
        name,
        username,
        confirmationUrl: `${process.env.BASE_URL}/accounts/confirm?token=${token}`,
      },
    });

    return right({
      user,
    });
  }
}
