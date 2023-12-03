import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface NotificationProps {
    recipientId: UniqueEntityID;
    title: string;
    content: string;
    readAt?: Date;
    createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
    get recipientId(): UniqueEntityID {
        return this.props.recipientId;
    }

    get title(): string {
        return this.props.title;
    }

    get content(): string {
        return this.props.content;
    }

    get readAt(): Date | undefined {
        return this.props.readAt;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    private constructor(props: NotificationProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(props: Optional<NotificationProps, 'createdAt'> , id?: UniqueEntityID): Notification {
        const notification = new Notification({
            ...props,
            createdAt: props.createdAt ?? new Date()
        });

        return notification;
    }
}