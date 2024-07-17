"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameEventsGateway = void 0;
const game_events_service_1 = require("./game_events.service");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let GameEventsGateway = class GameEventsGateway {
    constructor(gameEventsService) {
        this.gameEventsService = gameEventsService;
        this.sockets = [
            { turn: true, id: '' },
            { turn: false, id: '' }
        ];
        this.playersFinished = [];
    }
    sendId(client, room) {
        this.server.sockets.adapter.rooms.get(room).size === 1 ? (this.sockets[0].id = client.id) : (this.sockets[1].id = client.id);
    }
    createRoom(client, room) {
        console.log("room created", "--->", room);
        client.emit('getId', { socketId: client.id });
        client.join(room);
    }
    checkIfExists(client, room) {
        const id = client.id;
        if (this.server.sockets.adapter.rooms.get(room)) {
            console.log(this.server.sockets.adapter.rooms.get(room));
            client.join(room);
            client.emit('getResp', { id });
            const exist = true;
            this.server.in(room).emit('response', { exist });
        }
        else {
            const notFound = false;
            client.emit('error', { notFound });
        }
    }
    finishFirstStage(socket, { room }) {
        this.playersFinished.push('finished');
        console.log(socket.rooms, "-->", this.playersFinished);
        this.playersFinished.length === 2 ? this.server.to(room).emit('playerFinishedPreparing', { message: "hello" }) : null;
    }
    attackShip(socket, data) {
        console.log(data, data.y, data.x, socket.rooms);
        socket.to(data.room).emit('getAttacked', { y: data.y, x: data.x });
    }
    onGotAttackedTrue(socket, data) {
        console.log('attacked', data);
        socket.to(data.room).emit('attacked', { y: data.y, x: data.x });
    }
    onGotAttackedFalse(socket, data) {
        console.log('missed', data, data.room);
        socket.to(data.room).emit('missed', { y: data.y, x: data.x });
    }
    changeTurn(socket, data) {
        console.log("69", data);
        if (data.beginning) {
            data.socketId === this.sockets[0].id
                ? socket.to(data.room).emit('turn', { turn: this.sockets[0].turn })
                : socket.to(data.room).emit('turn', { turn: this.sockets[1].turn });
        }
        else {
            this.sockets.forEach(sk => {
                sk.turn = !sk.turn;
            });
            this.server.in(data.room).emit('turn');
        }
    }
    finish(socket, { room }) {
        console.log('finish', room);
        this.server.in(room).emit('finish');
    }
    afterInit(server) {
        console.log(server);
    }
    handleDisconnect(client) {
        console.log(`Disconnected: ${client.id}`);
    }
    handleConnection(client, ...args) {
        console.log(`Connected ${client.id}, args: ${args}`);
    }
};
exports.GameEventsGateway = GameEventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameEventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendId'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameEventsGateway.prototype, "sendId", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createRoom'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameEventsGateway.prototype, "createRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('checkIfExists'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], GameEventsGateway.prototype, "checkIfExists", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('finishedPreparing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameEventsGateway.prototype, "finishFirstStage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('checkForShip'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameEventsGateway.prototype, "attackShip", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('gotAttacked_True'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameEventsGateway.prototype, "onGotAttackedTrue", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('gotAttacked_False'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameEventsGateway.prototype, "onGotAttackedFalse", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('changeTurn'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameEventsGateway.prototype, "changeTurn", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('finishGame'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameEventsGateway.prototype, "finish", null);
exports.GameEventsGateway = GameEventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: 'http:/localhost:5500',
            methods: ['GET', 'POST']
        }
    }),
    __metadata("design:paramtypes", [game_events_service_1.GameEventsService])
], GameEventsGateway);
