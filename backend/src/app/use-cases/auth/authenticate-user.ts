import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { UsersRepository } from '@/app/repositories/users-repository';
import { HashComparer } from '@/app/cryptography/hash-comparer';
import { Encrypter } from '@/app/cryptography/encrypter';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    id: string;
    name: string;
    username: string;
    photo: string | null;
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new WrongCredentialsError());
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    return right({
      id: user.id.toString(),
      name: user.name,
      username: user.username,
      photo: user.photo || null,
      accessToken,
    });
  }
}
