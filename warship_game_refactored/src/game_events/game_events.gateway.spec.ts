import { Test, TestingModule } from '@nestjs/testing';
import { GameEventsGateway } from './game_events.gateway';
import { GameEventsService } from './game_events.service';

describe('GameEventsGateway', () => {
  let gateway: GameEventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameEventsGateway, GameEventsService],
    }).compile();

    gateway = module.get<GameEventsGateway>(GameEventsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
