import { PartialType } from '@nestjs/mapped-types';
import { CreateGameEventDto } from './create-game_event.dto';

export class UpdateGameEventDto extends PartialType(CreateGameEventDto) {
  id: number;
}
