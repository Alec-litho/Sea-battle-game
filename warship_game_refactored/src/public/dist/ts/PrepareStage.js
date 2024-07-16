"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrepareStage = void 0;
const Game_js_1 = require("./Game.js");
class PrepareStage extends Game_js_1.Game {
    constructor(socket, room, gameLogic) {
        super(socket, room);
        this.board = document.querySelector('.board');
        this.direction = "horizontal";
        this.shipsHTML = document.querySelectorAll('.shipToPut');
        this.turnAround = document.querySelector(".turnAround");
        this.finishBTN = document.querySelector('.btn');
        this.shipsCount = [0, 0, 0, 0];
        this.shipTypeList = [[2], [2, 2], [2, 2, 2], [2, 2, 2, 2]];
        this.isDragging = false;
        this.shipType = {
            type: this.shipTypeList[0],
            direction: this.direction
        };
        this.game = gameLogic;
        this.render = setInterval(() => this.renderShips(), 200);
        this.finishBTN.addEventListener("click", () => this.finishPrepareStage());
        this.removeStyles();
        this.turnAround.addEventListener("click", () => this.changeDirectionHTML());
        this.board.addEventListener("dragover", (e) => {
            const el = e.target;
            this.currentElement = el;
            if (this.isDragging && (el.classList[0] === "cell")) {
                this.game.paintShipArea(el.dataset.cord, this.shipType, this.cellsPlayerOne);
            }
        });
        this.cellsPlayerOne.forEach(cell => {
            cell.addEventListener("dragleave", () => {
                this.game.clearShipArea(this.cellsPlayerOne);
            });
        });
        this.shipsHTML.forEach(ship => {
            ship.addEventListener("dragstart", (e) => {
                this.isDragging = true;
                this.chooseShip(e);
            });
            ship.addEventListener("dragend", () => {
                this.isDragging = false;
                this.placeShip();
            });
        });
    }
    removeStyles() {
        function qselect(HTMLclass) { return document.querySelector(HTMLclass); }
        const [game, gameContainer, startGame] = [qselect('.game'), qselect('.gameContainer'), qselect('.startGame')];
        game.style.display = 'flex';
        gameContainer.style.display = 'flex';
        startGame.style.display = 'none';
    }
    chooseShip(e) {
        const target = e.target;
        const num = +target.dataset.num;
        console.log(num, num - 1, this.shipTypeList);
        this.shipType.type = this.shipTypeList[num - 1];
        const shipsToPut = target.parentNode.childNodes;
        shipsToPut.forEach(el => { if (el.className === "shipToPut")
            el.style.border = "3px solid rgb(42, 113, 146)"; });
        target.style.border = "3px solid rgb(122, 208, 248)";
    }
    renderShips() {
        [...this.cellsPlayerOne].forEach((cell) => {
            for (let y = 0; y < this.game.map.length; y++) {
                for (let x = 0; x < this.game.map[y].length; x++) {
                    if (this.game.map[y][x] === 2) {
                        cell.dataset.cord === [y, x].join('') ? cell.classList.add('ship') : null;
                    }
                }
            }
        });
    }
    placeShip() {
        if (!this.currentElement)
            return;
        const target = this.currentElement;
        const { x, y } = { x: target.dataset.cord[1], y: target.dataset.cord[0] };
        const cords = y.toString() + x.toString();
        if (this.game.checkForShip(x, y)) {
            console.log(`exists`, this.game.existingShips);
        }
        else if (this.game.checkForBarriers(cords, this.shipType)) {
            console.log('cant place it here');
        }
        else {
            const ship = this.game.createShip(Number.parseFloat(y), Number.parseFloat(x), this.shipType);
            this.game.appendShip(ship);
            this.incrementShipCount();
        }
    }
    incrementShipCount() {
        switch (this.shipType.type.length) {
            case 1:
                this.shipsCount[0]++;
                break;
            case 2:
                this.shipsCount[1]++;
                break;
            case 3:
                this.shipsCount[2]++;
                break;
            case 4:
                this.shipsCount[3]++;
                break;
        }
        this.updateShipsDOM(this.shipsCount);
    }
    setCurrentShip() {
        if (this.shipType.type === undefined)
            return;
        const id = this.shipType.type.length == 1 ? '1' : this.shipType.type.length == 2 ? '2' : this.shipType.type.length == 3 ? '3' : '4';
        const shipsToPut = document.querySelectorAll('.shipToPut');
        [...shipsToPut].filter(shipHTML => shipHTML.dataset.num === id)[0].style.border = "3px solid rgb(122, 208, 248)";
    }
    updateShipsDOM(arr) {
        arr.forEach((ship, indx) => {
            if (ship === arr.length - indx) {
                const htmlEl = [...this.shipsHTML].filter((el) => el.getAttribute('id') === `${indx + 1}`)[0];
                console.log(ship, htmlEl);
                htmlEl.classList.add('hide');
                this.shipTypeList.splice(indx, 1, null);
                this.shipType.type = this.shipTypeList.filter((ship) => ship !== null)[0];
            }
        });
        this.setCurrentShip();
    }
    changeDirectionHTML() {
        const oldDir = this.direction;
        this.direction = this.direction === "horizontal" ? "vertical" : "horizontal";
        this.shipType.direction = this.direction;
        const ships = document.querySelector(`.ships`);
        ships.classList.remove(`ships`, `${oldDir}`);
        ships.classList.add(`ships`, `${this.direction}`);
    }
    finishPrepareStage() {
        console.log(this);
        if (this.game.existingShips) {
            clearInterval(this.render);
            this.socket.emit('finishedPreparing', { room: this.room });
            document.querySelector('.leftCont').style.display = 'none';
        }
        else {
            console.log('some ships are not used');
        }
    }
}
exports.PrepareStage = PrepareStage;
