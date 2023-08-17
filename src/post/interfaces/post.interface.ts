export interface PostInterface {
    author: {
        id: string;
        username: string;
        name: string;
        photo: string;
    };
    id: string;
    text: string | null;
    images: string[];
    authorId: string;
    createdAt: Date;
    updatedAt: Date | null;
    Like: {}[]
    _count: { Comment: number, Like: number }
}
