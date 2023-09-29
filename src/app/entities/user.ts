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
export interface UserSummary {
  id: string;
  username: string;
  name: string;
  photo: string | null;
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

  public get token(): string | null | undefined {
    return this.props.token;
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
  getSummary(): UserSummary {
    return {
      id: this.id.toString(),
      username: this.username,
      name: this.name,
      photo: this.photo,
    };
  }

  confirmAccount() {
    this.props.token = null;
    this.props.emailVerifiedAt = new Date();
  }

  updateUser(newProps: Partial<UserProps>) {
    this.props = { ...this.props, ...newProps };
    this.touch();
  }

  deleteUser() {
    this.props.deletedAt = new Date();
  }

  static create(props: UserProps, id?: UniqueEntityID) {
    if (props.token === undefined) {
      props.token = new UniqueEntityID().toString();
    }
    const user = new User(props, id);

    return user;
  }
}
