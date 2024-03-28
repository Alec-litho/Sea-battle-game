import { Test, TestingModule } from '@nestjs/testing';
import { GameEventsService } from './game_events.service';

describe('GameEventsService', () => {
  let service: GameEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameEventsService],
    }).compile();

    service = module.get<GameEventsService>(GameEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
