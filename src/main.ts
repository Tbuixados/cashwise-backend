import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // quita campos extra del body
      forbidNonWhitelisted: true, // arroja error si vienen campos extra
    }),
  ); //permite a nest responder automaticamente a los request invalidos

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
