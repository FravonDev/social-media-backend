import exp from 'constants';
import { User, UserProps } from './user';

describe('User Entity', () => {
  const initialUserData: UserProps = {
    email: 'johndoe@example.com',
    password: 'hashedPassword',
    username: 'johndoe',
    name: 'John Doe',
    photo: null,
    bio: null,
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null,
    emailVerifiedAt: null,
  };

  it('should create a user', () => {
    const user = User.create(initialUserData);

    expect(user.email).toEqual(initialUserData.email);
    expect(user.password).toEqual(initialUserData.password);
    expect(user.username).toEqual(initialUserData.username);
    expect(user.name).toEqual(initialUserData.name);
    expect(user.photo).toEqual(initialUserData.photo);
    expect(user.bio).toEqual(initialUserData.bio);
    expect(user.createdAt).toEqual(expect.any(Date));
    expect(user.updatedAt).toEqual(initialUserData.updatedAt);
    expect(user.deletedAt).toEqual(initialUserData.deletedAt);
    expect(user.emailVerifiedAt).toEqual(initialUserData.emailVerifiedAt);
  });

  it('should set updatedAt when updating user data', () => {
    const user = User.create(initialUserData);

    const newUserData: Partial<UserProps> = {
      name: 'New Name',
      bio: 'New Bio',
    };

    user.updateUser(newUserData);

    expect(user.name).toEqual(newUserData.name);
    expect(user.bio).toEqual(newUserData.bio);
    expect(user.updatedAt).toBeTruthy();
  });

  it('should set deletedAt when deleting user', () => {
    const user = User.create(initialUserData);

    user.deleteUser();

    expect(user.deletedAt).toBeInstanceOf(Date);
  });
});
