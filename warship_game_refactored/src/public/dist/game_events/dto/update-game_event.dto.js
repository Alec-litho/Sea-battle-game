"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGameEventDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_game_event_dto_1 = require("./create-game_event.dto");
class UpdateGameEventDto extends (0, mapped_types_1.PartialType)(create_game_event_dto_1.CreateGameEventDto) {
}
exports.UpdateGameEventDto = UpdateGameEventDto;
