import { GameEventsService } from './game_events.service'
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: 'http:/localhost:5500',
    methods: ['GET', 'POST']
  }
})
export class GameEventsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
  constructor(private readonly gameEventsService: GameEventsService) {}
  private sockets = [
    { turn: true, id: '' },
    { turn: false, id: '' }
  ]
  private playersFinished = []
  @WebSocketServer() server: Server

  @SubscribeMessage('sendId')
  sendId(client: Socket, room: string): void {
    this.server.sockets.adapter.rooms.get(room).size === 1 ? (this.sockets[0].id = client.id) : (this.sockets[1].id = client.id)
  }

  @SubscribeMessage('createRoom')
  createRoom(client: Socket, room: string) {
    client.emit('getId', { socketId: client.id })
    client.join(room)
  }

  @SubscribeMessage('checkIfExists')
  checkIfExists(client: Socket, room: string) {
    const id = client.id
    if (this.server.sockets.adapter.rooms.get(room)) {
      client.join(room)
      client.emit('getResp', { id })
      const exist = true
      this.server.in(room).emit('response', { exist })
    } else {
      const notFound = false
      client.emit('error', { notFound })
    }
  }
  @SubscribeMessage('finishedPreparing')
  finishFirstStage(client: Socket, room: string) {
    this.playersFinished.push('finished')
    this.playersFinished.length === 2 ? this.server.in(room).emit('playerFinishedPreparing') : null
  }
  @SubscribeMessage('checkForShip')
  attackShip(client: Socket, x: number, y: number, room: string) {
    console.log(y, x)
    client.to(room).emit('getAttacked', { y, x })
  }
  @SubscribeMessage('gotAttacked_True')
  onGotAttackedTrue(client: Socket, x: number, y: number, room: string) {
    console.log('attacked')
    client.to(room).emit('attacked', { y, x })
  }
  @SubscribeMessage('gotAttacked_False')
  onGotAttackedFalse(client: Socket, x: number, y: number, room: string) {
    console.log('missed')
    client.to(room).emit('missed', { y, x })
  }
  @SubscribeMessage('changeTurn')
  changeTurn(client: Socket, socketId: string, beginning: boolean) {
    if (beginning) {
      socketId === this.sockets[0].id
        ? this.server.to(this.sockets[0].id).emit('turn', { turn: this.sockets[0].turn })
        : this.server.to(this.sockets[1].id).emit('turn', { turn: this.sockets[1].turn })
    } else {
      this.sockets.forEach(socket => {
        socket.turn = !socket.turn
        this.server.to(socket.id).emit('turn', { turn: socket.turn })
      })
    }
  }

  afterInit(server: Server) {
    console.log(server)
  }
  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`)
  }

  handleConnection(client: Socket, ...args: string[]) {
    console.log(`Connected ${client.id}, args: ${args}`)
  }
}
