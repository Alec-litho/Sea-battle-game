export class Game {
    constructor(socket, room) {
        this.cellsPlayerOne = [...document.querySelector('.board').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE);
        this.cellsPlayerTwo = [...document.querySelector('.boardPlayerTwo').childNodes].filter(cell => cell.nodeType === Node.ELEMENT_NODE);
        this.socket = socket;
        this.room = room;
    }
}
