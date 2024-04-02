
import { AppService } from './app.service';
import { Controller } from '@nestjs/common';
// import { Get, Request } from '@nestjs/common';
// import Express from 'express';
import { Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/test') 
  getReq(/*@Request() req: Express.Request*/) {
    console.log("w")
  }
}
