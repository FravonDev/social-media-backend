import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface FollowProps {
  followerId: string;
  followedId: string;
  createdAt: Date;
}

export class Follow extends Entity<FollowProps> {
  get followerId(): string {
    return this.props.followerId;
  }

  get followedId(): string {
    return this.props.followedId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(props: FollowProps, id?: UniqueEntityID) {
    const user = new Follow(props, id);
    return user;
  }
}
