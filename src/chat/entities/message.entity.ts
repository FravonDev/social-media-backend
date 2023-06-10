export class Message {
  sender: string;
  recipient: string;
  text: string;
  sentAt: Date;
  readAt?: Date | null;
}
