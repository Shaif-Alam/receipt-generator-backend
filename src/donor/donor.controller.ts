import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DonorService } from './donor.service';
import { CreateDonationDto, CreateExistingDonorDonationDto } from './dto/create-donor.dto';

@Controller('donor')
export class DonorController {
  constructor(private readonly donorService: DonorService) {}

  @Post('new')
  async createNewDonorAndDonation(@Body() createDonorDto: CreateDonationDto):Promise<any> {
    return this.donorService.createNewDonor(createDonorDto);
  }

  @Post('existing')
  async createExistingDonorAndDonation(@Body() createDonorDto: CreateExistingDonorDonationDto):Promise<any> {
    return this.donorService.createExistingDonor(createDonorDto);
  }

  @Get()
  async getDonors(
    @Query('page')  page:string,
    @Query('limit') limit:string,
  ):Promise<any> {
    return this.donorService.getDonors(page, limit);
  } 
  
}
