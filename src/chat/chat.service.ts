import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {
  chats: Chat[] = [];
  async createMessage(payload: Chat) {
    await this.chats.push(payload);
  }

  async getMessages(sender: string, recipient: string): Promise<Chat[]> {
    const data = this.chats.filter(
      (item) =>
        (item.sender == sender && item.recipient == recipient) ||
        (item.recipient == sender && item.sender == recipient),
    );
    return;
  }
}
