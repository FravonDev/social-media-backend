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
import { WSAuthMiddleware } from './middlewares/ws-auth.middleware';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  afterInit(server: Server) {
    const middle = WSAuthMiddleware(this.jwtService, this.userService)
    server.use(middle)
    console.log('Chat gateway initialized');
    setInterval(() => console.log(this.chatService.chats), 10000);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    

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
    console.log(previousMessages);
    
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
