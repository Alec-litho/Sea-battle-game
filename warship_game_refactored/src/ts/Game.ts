import { io } from "socket.io-client";
export class Game {
    protected cellsPlayerOne:HTMLElement[];
    protected cellsPlayerTwo:HTMLElement[];
    protected socket: ReturnType<typeof io>;
    protected room: string;
    constructor(socket:ReturnType<typeof io>, room:string) {
        this.cellsPlayerOne = [...document.querySelector('.board').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE) as HTMLElement[]
        this.cellsPlayerTwo = [...document.querySelector('.boardPlayerTwo').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE) as HTMLElement[]
        this.socket = socket
        this.room = room

    }
}