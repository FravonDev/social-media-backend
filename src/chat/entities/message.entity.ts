export class Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  sentAt: Date;
  readAt?: Date | null;
}
