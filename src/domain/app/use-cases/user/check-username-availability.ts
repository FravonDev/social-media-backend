import { User, UserSummary } from '@/domain/app/entities/user';
import { UsersRepository } from '@/domain/app/repositories/users-repository';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface CheckUsernameAvailabilityUseCaseRequest {
  username: string;
}

type CheckUsernameAvailabilityUseCaseResponse = Either<
  null,
  {
    IsAvailable: boolean;
  }
>;

@Injectable()
export class CheckUsernameAvailabilityUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    username,
  }: CheckUsernameAvailabilityUseCaseRequest): Promise<CheckUsernameAvailabilityUseCaseResponse> {
    const IsAvailable = !(await this.usersRepository.findByUsername(username));
    // console.log('usernameIsAvaliable', IsAvailable);

    return right({
      IsAvailable,
    });
  }
}
