import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { Socket } from 'socket.io';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

export interface AuthSocket extends Socket {
  user: User;
}
export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;

export const WSAuthMiddleware = (
  jwtService: JwtService,
  userService: UserService,
): SocketMiddleware => {
  return async (socket: AuthSocket, next: NextFunction) => {
    try {
      const { access_token } = socket.handshake.query as {
        access_token: string;
      };
      const decodedToken = jwtService.verify(access_token, {
        secret: process.env.JWT_SECRET,
      });
      const userResult = await userService.findByEmail(decodedToken.email);
      if (userResult) {
        socket.user = userResult;
        next();
      } else {
        next({
          name: 'Unauthorizaed',
          message: 'Unauthorizaed',
        });
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        next({
          name: 'Unauthorized',
          message: 'Invalid access token',
        });
      } else if (error instanceof TokenExpiredError) {
        next({
          name: 'Unauthorized',
          message: 'Access token expired',
        });
      }
      next({
        name: 'Unauthorized',
        message: 'Unauthorized',
      });
    }
  };
};
