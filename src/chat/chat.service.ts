import { Injectable } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) { }
  private userSocketMaps: Map<string, string>[] = [];

  async getUserMessages(userId: string): Promise<Message[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId }]
      },
      orderBy: {
        sentAt: 'asc'
      }
    })

    return messages
  }

  async createMessage(payload: Message) {
    try {
      await this.prisma.message.create({ data: payload });
    } catch (error) {
      throw new Error('Recipient not found')
    }
  }

  getUserSocketId(userId: string): string {
    const userSocketMap = this.userSocketMaps.find((map) => map.has(userId));

    if (!userSocketMap) {
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