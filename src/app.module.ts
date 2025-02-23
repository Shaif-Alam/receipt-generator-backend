import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DonorModule } from './donor/donor.module';
import { DatabaseModule } from './database/database.module';
import { DonationModule } from './donation/donation.module';

@Module({
  imports: [DonorModule, DatabaseModule, DonationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
