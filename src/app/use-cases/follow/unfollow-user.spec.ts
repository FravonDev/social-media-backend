import { InMemoryUsersRepository } from '@test/repositories/in-memory-user-repository';
import { FollowUserUseCase } from './follow-user';
import { InMemoryFollowsRepository } from '@test/repositories/in-memory-follows-repository';
import { makeUser } from '@test/factories/make-user';
import { CreateUserUseCase } from '../user/create-user';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { UnfollowUserUseCase } from './unfollow-user';
import { NotFollowUserError } from './errors/not-following';

describe('Unfollow User', () => {
  let inMemoryFollowsRepository: InMemoryFollowsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  let fakeHasher: FakeHasher;

  let followUserUseCase: FollowUserUseCase;
  let unfollowUserUseCase: UnfollowUserUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();

    inMemoryFollowsRepository = new InMemoryFollowsRepository();

    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
    );

    followUserUseCase = new FollowUserUseCase(
      inMemoryFollowsRepository,
      inMemoryUsersRepository,
    );

    unfollowUserUseCase = new UnfollowUserUseCase(
      inMemoryFollowsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to unfollow a user', async () => {
    const johnny = makeUser({ name: 'Johnny J.' });
    const sarah = makeUser({ name: 'Sarah S.' });

    await createUserUseCase.execute(johnny);
    await createUserUseCase.execute(sarah);

    const johnnyresult = await inMemoryUsersRepository.findByUsername(
      johnny.username,
    );

    const sarahresult = await inMemoryUsersRepository.findByUsername(
      sarah.username,
    );

    if (johnnyresult && sarahresult) {
      await followUserUseCase.execute({
        followerId: johnnyresult.id.toString(),
        username: sarahresult.username,
      });

      const result = await unfollowUserUseCase.execute({
        followerId: johnnyresult.id.toString(),
        username: sarahresult.username,
      });

      expect(result.isRight()).toBeTruthy();
      expect(result.value).toBeUndefined();
    } else {
      fail('User not found.');
    }
  });

  it('should throw NotFollowError when trying to unfollow a user that is not being followed', async () => {
    const johnny = makeUser({ name: 'Johnny J.' });
    const sarah = makeUser({ name: 'Sarah S.' });

    await createUserUseCase.execute(johnny);
    await createUserUseCase.execute(sarah);

    const johnnyresult = await inMemoryUsersRepository.findByUsername(
      johnny.username,
    );
    const sarahresult = await inMemoryUsersRepository.findByUsername(
      sarah.username,
    );

    if (johnnyresult && sarahresult) {
      const result = await unfollowUserUseCase.execute({
        followerId: johnnyresult.id.toString(),
        username: sarahresult.username,
      });

      expect(result.isLeft()).toBeTruthy();
      expect(result.value).toBeInstanceOf(NotFollowUserError);
    } else {
      fail('User not found.');
    }
  });
});
