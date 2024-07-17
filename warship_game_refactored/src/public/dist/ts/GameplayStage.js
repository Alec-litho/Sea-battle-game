"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameplayStage = void 0;
const Game_js_1 = require("./Game.js");
class GameplayStage extends Game_js_1.Game {
    constructor(socket, room, game, playerTurn) {
        super(socket, room);
        this.board = document.querySelector(".boardPlayerTwo.none");
        this.finishModal = document.querySelector(".finishModal");
        this.backGround = document.querySelector(".bg");
        this.currObj = this;
        this.game = game;
        this.playerTurn = playerTurn;
        this.board.className = this.playerTurn ? "boardPlayerTwo" : "boardPlayerTwo turn";
        this.board.addEventListener("click", this.attack.bind(this.currObj));
        this.socket.on("turn", () => this.changeTurn());
        this.socket.on("finish", () => { this.finishModal.classList.add("show"); this.backGround.classList.add("show"); });
        if (!this.playerTurn) {
            console.log("another player turn");
            this.getAttacked();
            this.clearCurrentAttack(this.cellsPlayerTwo);
        }
    }
    attack(e) {
        const el = e.target;
        console.log(el);
        if (this.playerTurn && el.classList[0] === "cell") {
            this.socket.emit('checkForShip', { x: el.dataset.cord[1], y: el.dataset.cord[0], room: this.room });
            this.socket.on('missed', () => {
                console.log("missed");
                el.classList.add('attacked');
                this.socket.emit('changeTurn', { socketId: this.socket.id, room: this.room });
            });
            this.socket.on('attacked', () => {
                console.log("attacked");
                el.classList.add('attackedShip');
                this.socket.off('attacked');
                this.socket.off('missed');
            });
        }
    }
    getAttacked() {
        this.socket.on('getAttacked', (cords) => {
            const { y, x } = cords;
            const result = this.game.attackShip(+y, +x);
            this.socket.off("missed");
            this.socket.off("attacked");
            console.log(this);
            if (result === true) {
                if (this.game.isGameOver()) {
                    console.log("finish");
                    this.socket.emit("finishGame", { room: this.room });
                }
                else {
                    this.socket.emit("gotAttacked_True", { y, x, room: this.room });
                }
            }
            else {
                this.socket.emit("gotAttacked_False", { y, x, room: this.room });
            }
        });
    }
    changeTurn() {
        console.log('w');
        this.socket.off('missed');
        this.socket.off('attacked');
        this.socket.off('getAttacked');
        this.clearCurrentAttack(this.cellsPlayerTwo);
        this.playerTurn = !this.playerTurn;
        if (this.playerTurn === false) {
            this.getAttacked();
            this.board.className = "boardPlayerTwo turn";
        }
        else {
            this.board.className = "boardPlayerTwo";
        }
    }
    clearCurrentAttack(enemyCells) {
        enemyCells.forEach((enemyCell) => {
            enemyCell.removeEventListener('click', this.attack);
        });
    }
}
exports.GameplayStage = GameplayStage;
