import { User, UserSummary } from '@/domain/app/entities/user';
import { UsersRepository } from '@/domain/app/repositories/users-repository';
import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';

interface SearchUsersUseCaseRequest {
  query: string;
  offset: number;
  limit: number;
}

type SearchUseCaseResponse = Either<
  null,
  {
    usersSummary: UserSummary[];
  }
>;

@Injectable()
export class SearchUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    query,
    offset,
    limit,
  }: SearchUsersUseCaseRequest): Promise<SearchUseCaseResponse> {
    const users = await this.usersRepository.findManyUsersWithPagination(
      query,
      offset,
      limit,
    );

    return right({
      usersSummary: users,
    });
  }
}
