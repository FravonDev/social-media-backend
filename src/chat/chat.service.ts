import { Injectable } from '@nestjs/common';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {

  chats: Chat[] = [];
  private recipientSocketMaps: Map<string, string>[] = [];

  getUserMessages(userId: string) {
    const data = this.chats.filter(
      (item) =>
        (item.sender == userId) || (item.recipient == userId)
        //TODO:order: { timestamp: 'ASC' },
    );
    return data;
  }

  async createMessage(payload: Chat) {
    await this.chats.push(payload);
  }

  getRecipientSocketId(userId: string): string {
    const recipientSocketMap = this.recipientSocketMaps.find((map) => map.has(userId));

    if (!recipientSocketMap) {
      throw new Error('Recipient not found')
    }

    return recipientSocketMap.get(userId);
  }

  saveRecipientSocketId(userId: string, socketId: string): void {
    let recipientSocketMap = this.recipientSocketMaps.find((map) => map.has(userId));

    if (!recipientSocketMap) {
      recipientSocketMap = new Map<string, string>();
      this.recipientSocketMaps.push(recipientSocketMap);
    }

    recipientSocketMap.set(userId, socketId);
  }

  removeRecipientSocketId(userId: string): void {
    const recipientMapIndex = this.recipientSocketMaps.findIndex((map) => map.has(userId));

    if (recipientMapIndex == -1) {
      throw new Error('Recipient not found')
    }
    this.recipientSocketMaps.splice(recipientMapIndex, 1);

  }
}
