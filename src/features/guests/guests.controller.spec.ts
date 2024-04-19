import { Test, TestingModule } from '@nestjs/testing';
import { GuestsController } from './guests.controller';
import { GuestsService } from './guests.service';

describe('GuestsController', () => {
  let guestsController: GuestsController;
  let guestsService: GuestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestsController],
      providers: [GuestsService],
    }).compile();

    guestsController = module.get<GuestsController>(GuestsController);
    guestsService = module.get<GuestsService>(GuestsService);
  });

  describe('Assign guests', () => {
    it('should return the assign guests', async () => {});
  });
});
