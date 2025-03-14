import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Library Management System API')
    .setDescription(
      'API untuk mengelola peminjaman dan pengembalian buku perpustakaan',
    )
    .setVersion('1.0')
    .addTag('Books', 'Operasi terkait buku')
    .addTag('Members', 'Operasi terkait anggota')
    .addTag('Transactions', 'Operasi terkait peminjaman dan pengembalian')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
    },
  };

  SwaggerModule.setup('api/docs', app, document, customOptions);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
