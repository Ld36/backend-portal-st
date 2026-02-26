import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresasModule } from './empresas/empresas.module';
import { RhModule } from './rh/rh.module';

@Module({
  imports: [EmpresasModule, RhModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
