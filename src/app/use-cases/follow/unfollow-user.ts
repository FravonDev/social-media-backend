import { Either, left, right } from '@/core/either';
import { UserNotFoundError } from '../../../core/errors/shared/user-not-found';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/app/repositories/users-repository';
import { FollowsRepository } from '@/app/repositories/follows-repository';
import { Follow } from '@/app/entities/follow';
import { NotFollowUserError } from './errors/not-following';

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
    const user = await this.usersRepository.findByUsername(username);

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
    console.log(result);
    console.log(typeof result);
    return right(result);
  }
}
