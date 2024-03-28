import { Module } from '@nestjs/common';
import { GameEventsService } from './game_events.service';
import { GameEventsGateway } from './game_events.gateway';

@Module({
  providers: [GameEventsGateway, GameEventsService],
})
export class GameEventsModule {}
