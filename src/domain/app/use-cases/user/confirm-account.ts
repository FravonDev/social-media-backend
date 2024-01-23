import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { User } from '@/domain/app/entities/user';
import { UserNotFoundError } from '@/core/errors/shared/user-not-found';
import { UsersRepository } from '@/domain/app/repositories/users-repository';

export interface ConfirmUseCaseRequest {
  token: string;
}

type ConfirmUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User;
  }
>;

@Injectable()
export class ConfirmAccountUseCase {
  constructor(private UsersRepository: UsersRepository) {}
  async execute({
    token,
  }: ConfirmUseCaseRequest): Promise<ConfirmUseCaseResponse> {
    const user = await this.UsersRepository.findByToken(token);

    if (!user) {
      return left(new UserNotFoundError());
    }

    user.confirmAccount();

    await this.UsersRepository.save(user);

    return right({ user });
  }
}
