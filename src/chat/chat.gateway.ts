import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthSocket, WSAuthMiddleware } from './middlewares/ws-auth.middleware';
import { CreateMessageDto } from './dto/create-message.dto';
import { v4 as uuid } from 'uuid';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsCatchAllFilter } from './filters/ws-catch-all.filters';
import { TypingDto } from './dto/typing-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(new WsCatchAllFilter())
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true
}))
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  afterInit(server: Server) {
    const middle = WSAuthMiddleware(this.jwtService, this.userService)
    server.use(middle)
  }

  async handleConnection(client: AuthSocket, ...args: any[]) {
    this.chatService.saveUserSocketId(client.user.id, client.id);

    const data = await this.chatService.getUserMessages(client.user.id);

    this.server.to(client.id).emit('getPreviousMessages', data);
  }

  handleDisconnect(client: AuthSocket) {
    this.chatService.removeUserSocketId(client.user.id);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: AuthSocket, payload: CreateMessageDto): Promise<void> {
    const { recipientId, text } = payload;

    await this.chatService.createMessage({
      id: uuid(),
      senderId: client.user.id,
      recipientId,
      text,
      sentAt: new Date()
    });

    const recipientSocketId = this.chatService.getUserSocketId(recipientId);

    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('receiveMessage', {
        ...payload,
        sender: client.user.id
      });
    }
  }
  @SubscribeMessage('typing')
  async typing(client: AuthSocket, payload: TypingDto) {
    const { recipientId } = payload

    const recipientSocketId = this.chatService.getUserSocketId(recipientId);

    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('isTyping', true);
    }
  }
}
