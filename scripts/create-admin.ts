import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';

async function createAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    const admin = await authService.createAdmin({
      name: 'Administrador',
      email: 'admin@portal.com',
      password: 'admin123456'
    });

    console.log(' Admin criado com sucesso!');
    console.log(' Email:', admin.email);
    console.log(' Senha: admin123456');
    console.log('');
    console.log('Use POST /auth/login para fazer login');
    
  } catch (error) {
    console.error(' Erro ao criar admin:', error.message);
  }

  await app.close();
}

createAdmin();