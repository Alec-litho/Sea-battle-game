import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameEventsModule } from './game_events/game_events.module';
import {ServeStaticModule} from "@nestjs/serve-static"
import {join} from 'node:path';

@Module({ 
  imports: [
    GameEventsModule, 
    ServeStaticModule.forRoot({ 
      rootPath: join(__dirname,'..')  
    }) 
  ],
  controllers: [AppController],
  providers: [AppService],
}) 
export class AppModule {}
