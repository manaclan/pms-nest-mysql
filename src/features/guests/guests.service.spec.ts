import { Test, TestingModule } from '@nestjs/testing';
import { GuestsService } from './guests.service';
import { CheckinListDTO } from './dtos/checkinList.dto';

describe('GuestsService', () => {
  let service: GuestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestsService],
    }).compile();

    service = module.get<GuestsService>(GuestsService);
  });

  it('should be defined', async () => {
    const mockData: CheckinListDTO = {
      roomsWithGuests: [
        {
          roomId: '4',
          guests: [
            {
              firstName: 'NGUYỄN VĂN',
              lastName: 'GGGG',
              phone: '091234562',
              email: 'email12@gmail.com',
              address: 'address1',
              gender: true,
              birthDate: new Date('19/12/1992'),
            },
          ],
        },
      ],
    };
    // jest.spyOn(service, 'checkinList').mockImplementation(() => mockData);

    expect(await service.checkinList('HCM1', mockData)).toBe([
      {
        name: 'GGGG NGUYỄN VĂN',
        lastName: 'GGGG',
        firstName: 'NGUYỄN VĂN',
        email: 'email12@gmail.com',
        phone: '091234562',
        address: 'address1',
      },
    ]);
  });
});
