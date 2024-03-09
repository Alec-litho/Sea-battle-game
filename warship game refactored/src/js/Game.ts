


class Game {
    protected cellsPlayerOne:Node[];
    protected cellsPlayerTwo:Node[];
    protected socket: any;
    protected room: any;
    constructor(socket:any, room:any) {
        this.cellsPlayerOne = [...document.querySelector('.board').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE)
        this.cellsPlayerTwo = [...document.querySelector('.boardPlayerTwo').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE)
        this.socket = socket
        this.room = room

    }
}