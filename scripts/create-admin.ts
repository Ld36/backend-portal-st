import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  const name = process.env.ADMIN_NAME ?? 'Administrador';
  const email = process.env.ADMIN_EMAIL ?? 'admin@portal.com';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123456';

  try {
    const admin = await authService.createAdmin({
      name,
      email,
      password,
    });

    console.log(' Admin criado com sucesso!');
    console.log(' Email:', admin.email);
    console.log(' Senha:', password);
    console.log('');
    console.log('Use POST /auth/login para fazer login');
    
  } catch (error) {
    console.error(' Erro ao criar admin:', error.message);
  }

  await app.close();
}

createAdmin();