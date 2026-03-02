import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins: string[] = [];
  const frontendUrl = process.env.FRONTEND_URL?.trim();

  if (frontendUrl) {
    allowedOrigins.push(frontendUrl);
  }

  if (process.env.NODE_ENV === 'production' && !frontendUrl) {
    throw new Error('FRONTEND_URL não configurada em produção');
  }

  if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000');
  }

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
  .setTitle('Portal de Serviço ST - API')
  .setDescription('Documentação técnica para cadastro de empresas e RH')
  .setVersion('1.0')
  .addTag('empresas')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
