import { Controller, Get, Query } from '@nestjs/common';
import { DonationService } from './donation.service';

@Controller('donation')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}
  @Get()
  async getDonors(
    @Query('page')  page:string,
    @Query('limit') limit:string,
  ):Promise<any> {
    return this.donationService.getDonations(page, limit);
  } 
  
  @Get("count")
  count() {
    return this.donationService.countDonations()
  }

}
