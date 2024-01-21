import { Either, left, right } from '@/core/either';
import { AlreadyFollowUserError } from './errors/already-follow';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/domain/app/repositories/users-repository';
import { FollowsRepository } from '@/domain/app/repositories/follows-repository';
import { Follow } from '@/domain/app/entities/follow';
import { UserNotFoundError } from '@/core/errors/shared/user-not-found';

interface FollowUserUseCaseRequest {
  followerId: string;
  username: string;
}

type FollowUsertUseCaseResponse = Either<
  AlreadyFollowUserError | UserNotFoundError,
  Follow
>;

@Injectable()
export class FollowUserUseCase {
  constructor(
    private followsRepository: FollowsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    followerId,
    username,
  }: FollowUserUseCaseRequest): Promise<FollowUsertUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      return left(new UserNotFoundError());
    }
    const followedId = user.id.toString();

    const alreadyFollows = await this.followsRepository.findByUserIds(
      followerId,
      followedId,
    );

    if (alreadyFollows) {
      return left(new AlreadyFollowUserError());
    }

    const follow = Follow.create({
      followerId,
      followedId,
      createdAt: new Date(),
    });

    await this.followsRepository.create(follow);

    return right(follow);
  }
}
