import { GameEventsService } from './game_events.service'
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody} from '@nestjs/websockets'
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
    console.log("room created","--->",room)
    client.emit('getId', { socketId: client.id })
    client.join(room)
  }

  @SubscribeMessage('checkIfExists')
  checkIfExists(client: Socket, room: string) {
    const id = client.id
    if (this.server.sockets.adapter.rooms.get(room)) {
      console.log(this.server.sockets.adapter.rooms.get(room))
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
  finishFirstStage(socket: Socket, {room}: {room:string}) {
    this.playersFinished.push('finished')
    console.log(socket.rooms, "-->", this.playersFinished) 
    this.playersFinished.length === 2 ? this.server.to(room).emit('playerFinishedPreparing', {message:"hello"}) : null
  }
  @SubscribeMessage('checkForShip')
  attackShip(@ConnectedSocket() socket: Socket,@MessageBody() data: {x: number, y: number, room: string}) {
    console.log(data, data.y, data.x, socket.rooms)
    socket.to(data.room).emit('getAttacked', {y:data.y, x:data.x})
  }
  @SubscribeMessage('gotAttacked_True')
  onGotAttackedTrue(socket: Socket, x: number, y: number, room: string) {
    console.log('attacked') 
    socket.to(room).emit('attacked', { y, x })
  }
  @SubscribeMessage('gotAttacked_False')
  onGotAttackedFalse(@ConnectedSocket() socket: Socket,@MessageBody() data: {x: number, y: number, room: string}) {
    console.log('missed', data, data.room)
    socket.to(data.room).emit('missed', { y:data.y, x:data.x })
  }
  @SubscribeMessage('changeTurn')
  changeTurn(@ConnectedSocket() socket: Socket, @MessageBody() data: {socketId: string, room:string,  beginning: boolean}) {
    if (data.beginning) {
      data.socketId === this.sockets[0].id
        ? socket.to(data.room).emit('turn', { turn: this.sockets[0].turn })
        : socket.to(data.room).emit('turn', { turn: this.sockets[1].turn })
    } else {
      this.sockets.forEach(sk => {
        sk.turn = !sk.turn;
        socket.to(data.room).emit('turn', { turn: sk.turn })
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
