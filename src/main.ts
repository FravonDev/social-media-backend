import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { EnvService } from './infra/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Social Media API')
    .setDescription(
      'This API provides a social media, including user management, posts, comments, and real-time chat. \n **Note**: This API utilizes WebSockets for real-time communication, providing features such as real-time chat and notifications. To interact with the WebSocket, please refer to the additional documentation available in our [README](https://github.com/FravonDev/social-media/blob/develop/README.md#websockets)',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  const configService = app.get(EnvService);
  const port = configService.get('PORT');
  app.listen(port);
}
bootstrap();
