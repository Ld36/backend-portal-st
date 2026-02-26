import { Module } from '@nestjs/common';
import { RhService } from './rh.service';

@Module({
  providers: [RhService]
})
export class RhModule {}
