import { Injectable } from '@nestjs/common';
import { CreateGameEventDto } from './dto/create-game_event.dto';
import { UpdateGameEventDto } from './dto/update-game_event.dto';

@Injectable()
export class GameEventsService {
  create(createGameEventDto: CreateGameEventDto) {
    return createGameEventDto
  }

  findAll() {
    return `This action returns all gameEvents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gameEvent`;
  }

  update(id: number, updateGameEventDto: UpdateGameEventDto) {
    return `This action updates a #${updateGameEventDto} gameEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} gameEvent`;
  }
}
