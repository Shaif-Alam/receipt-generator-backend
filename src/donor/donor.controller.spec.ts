import { Test, TestingModule } from '@nestjs/testing';
import { DonorController } from './donor.controller';
import { DonorService } from './donor.service';

describe('DonorController', () => {
  let controller: DonorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonorController],
      providers: [DonorService],
    }).compile();

    controller = module.get<DonorController>(DonorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
