import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/domain/app/repositories/users-repository';
import { UserSummary } from '@/domain/app/entities/user';
import { UserNotFoundError } from '@/core/errors/shared/user-not-found';

interface GetCurrentUserProfileUseCaseRequest {
  user_id: any;
}

type GetCurrentUserProfileUseCaseResponse = Either<
  UserNotFoundError,
  UserSummary
>;

@Injectable()
export class GetCurrentUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    user_id,
  }: GetCurrentUserProfileUseCaseRequest): Promise<GetCurrentUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      return left(new UserNotFoundError());
    }
    const userSummary = user.getSummary();

    return right(userSummary);
  }
}
