import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User): UserToken {
    //transforma em jwt
    const payload: UserPayload = {
      sub: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
    };
    const JwtToken = this.jwtService.sign(payload);

    return {
      access_token: JwtToken,
      id: payload.id,
      name: payload.name,
      username: payload.username,
      email: payload.email,
      photo: user.photo,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }
    //se chegar aqui, não encontrou, ou a senha não corresponde
    throw new Error('Email adress or password provided is incorrect.');
  }
}
