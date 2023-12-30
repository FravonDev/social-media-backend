import { Either, left, right } from '@/core/either';
import { AlreadyFollowUserError } from './errors/already-follow';
import { UserNotFoundError } from '../../../core/errors/shared/user-not-found';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/app/repositories/users-repository';
import { FollowsRepository } from '@/app/repositories/follows-repository';
import { Follow } from '@/app/entities/follow';

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
    const user = await this.usersRepository.findConfirmedByUsername(username);

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