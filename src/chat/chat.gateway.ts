import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Server, Socket } from 'socket.io';
import { Chat } from './entities/chat.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './exceptions/all-exceptions.filter';
import { WebsocketExceptionsFilter } from './exceptions/ws-exception.filter';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(WebsocketExceptionsFilter)
@UsePipes(new ValidationPipe({ transform: true }))export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  afterInit(server: Server) {
    console.log('Chat gateway initialized');
    setInterval(() => console.log(this.chatService.chats), 5000);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const { access_token } = client.handshake.query as { access_token: string };

      const decodedToken = this.jwtService.verify(access_token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findByEmail(decodedToken.email);
      if (!user) {
        throw new Error('');
      }
      const currentUser = { ...user, password: undefined };
      
      client.data = {
        currentUser,
      };

      const data = this.chatService.chats;
      this.server.emit('getPreviousMessages', data);
    } catch (error) {
      if (error instanceof JsonWebTokenError){
        throw new Error('Invalid access token')
      }else if (error instanceof TokenExpiredError){
        throw new Error('Access token expired');
      }
      client.disconnect();
    }
  }










  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: Chat): Promise<void> {
    const { sender, recipient, text } = payload;

    //TODO: save into db
    await this.chatService.createMessage(payload);
    //TODO: send to recipient
    this.server.to(recipient).emit('receiveMessage', payload);
  }

  @SubscribeMessage('getPreviousMessages')
  async handleGetPreviousMessages(
    client: Socket,
    payload: { sender: string; recipient: string },
  ): Promise<void> {
    const { sender, recipient } = payload;

    const previousMessages = await this.chatService.getMessages(
      sender,
      recipient,
    );
    // FIXME: Selecionar mensagens anteriores do banco de dados
    // const previousMessages = await this.chatService.find({
    //   where: [
    //     { sender, recipient },
    //     { sender: recipient, recipient: sender },
    //   ],
    //   order: { timestamp: 'ASC' },
    // });

    // Enviar as mensagens anteriores para o cliente
    client.emit('previousMessages', previousMessages);
  }
}
