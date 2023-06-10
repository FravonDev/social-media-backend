import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {

  messages: Message[] = [];
  private userSocketMaps: Map<string, string>[] = [];

  async getUserMessages(userId: string): Promise<Message[]> {
    const data = await this.messages.filter(
      (item) =>
        (item.sender == userId) || (item.recipient == userId)
        //TODO: order: { timestamp: 'ASC' },
    );
    console.log(userId);
    console.log(data);
    
    return data;
  }

  async createMessage(payload: Message) {
    await this.messages.push(payload);
    console.log(payload);
    
  }

  getUserSocketId(userId: string): string {
    const userSocketMap = this.userSocketMaps.find((map) => map.has(userId));
    if (!userSocketMap){
      return null
    }

    return userSocketMap.get(userId);
  }

  saveUserSocketId(userId: string, socketId: string): void {
    let userSocketMap = this.userSocketMaps.find((map) => map.has(userId));

    if (!userSocketMap) {
      userSocketMap = new Map<string, string>();
      this.userSocketMaps.push(userSocketMap);
    }

    userSocketMap.set(userId, socketId);
  }

  removeUserSocketId(userId: string): void {
    const userMapIndex = this.userSocketMaps.findIndex((map) => map.has(userId));

    if (userMapIndex == -1) {
      throw new Error('Recipient not found')
    }
    this.userSocketMaps.splice(userMapIndex, 1);
  }
}
