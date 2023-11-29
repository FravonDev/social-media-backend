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
import { UnfollowUserController } from './controllers/unfollow-user.controller';
import { UnfollowUserUseCase } from '@/app/use-cases/follow/unfollow-user';
import { MailModule } from '../mail/mail.module';
import { ConfirmAccountController } from './controllers/confirm-account.controller';
import { ConfirmAccountUseCase } from '@/app/use-cases/user/confirm-account';
import { SearchUsersController } from './controllers/search-users.controller';
import { SearchUsersUseCase } from '@/app/use-cases/search/search-user';
import { CheckUsernameAvailabilityUseCase } from '@/app/use-cases/user/check-username-availability';
import { CheckUsernameAvailabilityController } from './controllers/check-username-availability.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule, MailModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    FollowUserController,
    UnfollowUserController,
    ConfirmAccountController,
    SearchUsersController,
    CheckUsernameAvailabilityController
  ],
  providers: [
    /*
    here's where we'd put our usecases 
    and other necessary providers
    */
    CreateUserUseCase,
    AuthenticateUserUseCase,
    FollowUserUseCase,
    UnfollowUserUseCase,
    ConfirmAccountUseCase,
    SearchUsersUseCase,
    CheckUsernameAvailabilityUseCase
  ],
})
export class HttpModule {}
