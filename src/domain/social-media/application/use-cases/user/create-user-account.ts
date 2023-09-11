import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UserAlreadyExistsError } from './errors/user-already-exists';

export interface CreateUserAccountUseCaseRequest {
  email: string;
  password: string;
  username: string;
  name: string;
  photo: string | null;
  bio: string | null;
}

type CreateUserAccountUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;
@Injectable()
export class CreateUserAccountUseCase {
  constructor(private UsersRepository: UsersRepository) {}
  async execute({
    email,
    password,
    username,
    name,
    photo,
    bio,
  }: CreateUserAccountUseCaseRequest): Promise<CreateUserAccountUseCaseResponse> {
    const userWithsameEmail = await this.UsersRepository.findByEmail(email);
    if (userWithsameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    //generate hash password
    const user = User.create({
      email,
      password,
      username,
      name,
      photo,
      bio,
    });

    await this.UsersRepository.create(userAccount);

    return right({
      user,
    });
  }
}
