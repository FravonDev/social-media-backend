import { Module } from '@nestjs/common';

// import { AuthenticateController } from './controllers/authenticate.controller';
// import { CreateAccountController } from './controllers/create-account.controller';
import { DatabaseModule } from '../database/database.module';
import { CreateAccountController } from './controllers/create-account.controller';
import { CreateUserUseCase } from '@/app/use-cases/user/create-user';
import { CryptographyModule } from '../cryptography/cryptography.module';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController],
  providers: [
    /*
    here's where we'd put our usecases 
    and other necessary providers
    */
    CreateUserUseCase,
  ],
})
export class HttpModule {}
