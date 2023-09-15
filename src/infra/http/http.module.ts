import { Module } from '@nestjs/common';

// import { AuthenticateController } from './controllers/authenticate.controller';
// import { CreateAccountController } from './controllers/create-account.controller';
import { DatabaseModule } from '../database/database.module';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateUserUseCase } from '@/app/use-cases/user/create-user';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUserUseCase } from '@/app/use-cases/auth/authenticate-user';
import { FollowUserUseCase } from '@/app/use-cases/follow/follow-user';
import { FollowUserController } from './controllers/follow-user.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    FollowUserController,
  ],
  providers: [
    /*
    here's where we'd put our usecases 
    and other necessary providers
    */
    CreateUserUseCase,
    AuthenticateUserUseCase,
    FollowUserUseCase,
  ],
})
export class HttpModule {}
