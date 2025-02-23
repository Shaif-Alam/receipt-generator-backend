import { Module } from '@nestjs/common';
import { DonorService } from './donor.service';
import { DonorController } from './donor.controller';

@Module({
  controllers: [DonorController],
  providers: [DonorService],
})
export class DonorModule {}
