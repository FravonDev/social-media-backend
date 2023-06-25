import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WsBadRequestException } from './exceptions/ws-exceptions';
import { Prisma, Message as Message } from '@prisma/client';
import { v4 as uuid } from 'uuid'
import { CreateMessageDto } from './dto/create-message.dto';

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

  async getChatMessages(userId: string): Promise<Message[]> {
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

  async getUserMessagePreviews(userId: string): Promise<any> {
    const queryResult: Message[] = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      orderBy: { sentAt: 'desc' },
      distinct: ['senderId', 'recipientId'],
    });

    const messages = this.removeDuplicatedChat(queryResult)
    return messages;
  }

  async createMessage(senderId: string, payload: CreateMessageDto) {
    try {
      const { recipientId, text } = payload
      const data: Prisma.MessageCreateInput = {
        id: uuid(),
        sender: { connect: { id: senderId } },
        recipient: { connect: { id: recipientId } },
        text,
        sentAt: new Date()
      }
      await this.prisma.message.create({ data });
    } catch (error) {
      throw new WsBadRequestException('Recipient not found')
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
      throw new WsBadRequestException('Recipient not found')
    }

    this.userSocketMaps.splice(userMapIndex, 1);
  }

  removeDuplicatedChat(queryResult: Message[]) {
    const uniqueChats = new Map<string, Message>();

    for (const message of queryResult) {
      const chatKey = this.getChatKey(message);
      if (uniqueChats.has(chatKey)) {
        const existingMessage = uniqueChats.get(chatKey);
        if (message.sentAt > existingMessage.sentAt) {
          uniqueChats.set(chatKey, message);
        }
      } else {
        uniqueChats.set(chatKey, message);
      }
    }

    return Array.from(uniqueChats.values());
  }
  getChatKey(message: Message): string {
    const { senderId, recipientId } = message;
    const sortedIds = [senderId, recipientId].sort();
    return sortedIds.join('-');
  }
}