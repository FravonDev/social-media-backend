import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/domain/app/repositories/users-repository';
import { FollowsRepository } from '@/domain/app/repositories/follows-repository';
import { Follow } from '@/domain/app/entities/follow';
import { NotFollowUserError } from './errors/not-following';
import { UserNotFoundError } from '@/core/errors/shared/user-not-found';

interface UnfollowUserUseCaseRequest {
  followerId: string;
  username: string;
}

type UnfollowUserUseCaseResponse = Either<
  NotFollowUserError | UserNotFoundError,
  void
>;

@Injectable()
export class UnfollowUserUseCase {
  constructor(
    private followsRepository: FollowsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    followerId,
    username,
  }: UnfollowUserUseCaseRequest): Promise<UnfollowUserUseCaseResponse> {
    const user = await this.usersRepository.findConfirmedByUsername(username);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const followedId = user.id.toString();

    const alreadyFollows = await this.followsRepository.findByUserIds(
      followerId,
      followedId,
    );

    if (!alreadyFollows) {
      return left(new NotFollowUserError());
    }

    const result = await this.followsRepository.delete(alreadyFollows);
    return right(result);
  }
}
