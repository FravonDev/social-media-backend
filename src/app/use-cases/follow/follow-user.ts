import { Either, left, right } from '@/core/either';
import { AlreadyFollowUserError } from './errors/already-follow';
import { UserNotFoundError } from '../../../core/errors/shared/user-not-found';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@/app/repositories/users-repository';
import { FollowsRepository } from '@/app/repositories/follows-repository';
import { Follow } from '@/app/entities/follow';

interface FollowUserUseCaseRequest {
  followerId: string;
  followingId: string;
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
    followingId,
  }: FollowUserUseCaseRequest): Promise<FollowUsertUseCaseResponse> {
    const user = await this.usersRepository.findById(followingId);

    if (!user) {
      return left(new UserNotFoundError());
    }

    const alreadyFollows = await this.followsRepository.findByUserIds(
      followerId,
      followingId,
    );

    if (alreadyFollows) {
      return left(new AlreadyFollowUserError());
    }

    const follow = Follow.create({
      followerId,
      followingId,
      createdAt: new Date(),
    });

    await this.followsRepository.create(follow);

    return right(follow);
  }
}
