import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface UserProps {
  email: string;
  password: string;
  username: string;
  name: string;
  photo: string | null;
  bio: string | null;
  token?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
  emailVerifiedAt: Date | null;
}

export class User extends Entity<UserProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get photo(): string | null {
    return this.props.photo;
  }

  get bio(): string | null {
    return this.props.bio;
  }

  get username(): string {
    return this.props.username;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  get emailVerifiedAt(): Date | null {
    return this.props.emailVerifiedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  updateUser(newProps: Partial<UserProps>) {
    this.props = { ...this.props, ...newProps };
    this.touch();
  }

  deleteUser() {
    this.props.deletedAt = new Date();
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    const user = new User(props, id);

    return user;
  }
}
