// import {
//   Body,
//   Controller,
//   HttpCode,
//   InternalServerErrorException,
//   Post,
// } from '@nestjs/common';
// import { ApiOperation, ApiResponse } from '@nestjs/swagger';
// import { Public } from '@/infra/auth/public';
// import { SendEmailConfirmationBody } from './dtos/send-email-confirmation-body';
// import { GenerateConfirmationCodeUseCase } from '@/domain/confirmation/application/use-cases/generate-confirmation-code';

// @Controller('confirm-email')
// export class SendEmailConfirmationControlelr {
//   constructor(private sendConfirmation: GenerateConfirmationCodeUseCase) {}

//   @Post()
//   @HttpCode(201)
//   @ApiResponse({ status: 201, description: 'Sended' })
//   @ApiOperation({ summary: 'Send confirmation code to email' })
//   @Public()
//   async handle(@Body() body: SendEmailConfirmationBody) {
//     const { email } = body;

//     const result = await this.sendConfirmation.execute({
//       email,
//     });

//     if (result.isLeft()) {
//       const error = result.value;
//       switch (error == null) {
//         default:
//           throw new InternalServerErrorException("Couldn't send email");
//       }
//     }
//   }
// }
