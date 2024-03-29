import { Module } from '@nestjs/common';
import { EnvModule } from './infra/env/env.module';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './infra/env/env';
import { HttpModule } from '@/infra/http/http.module';
import { AuthModule } from './infra/auth/auth.module';
import { MailModule } from '@/infra/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    MailModule,
  ],
})
export class AppModule {}
