import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface PostProps {
  authorId: string;
  text: string;
  images: string[];
  createdAt: Date;
  updatedAt?: Date;
}

export class Post extends Entity<PostProps> {
  get authorId(): string {
    return this.props.authorId;
  }

  get text(): string {
    return this.props.text;
  }

  get images(): string[] {
    return this.props.images;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  updateText(newProps: Partial<PostProps>) {
    this.props = { ...this.props, ...newProps };
    this.touch();
  }

  static create(props: PostProps, id?: UniqueEntityID) {
    const post = new Post(props, id);
    const isNewPost = !id;
    if (isNewPost) {
      // post.addDomainEvent(new PostCreatedEvent(post));
    }
    return post;
  }
}
