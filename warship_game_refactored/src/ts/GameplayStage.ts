import { Game } from './Game.js'
import { io } from 'socket.io-client'

export class GameplayStage extends Game {
  public playerTurn: boolean
  game: GameLogicInterface
  board:HTMLElement = document.querySelector(".boardPlayerTwo.none");
  finishModal: HTMLElement = document.querySelector(".finishModal");
  backGround: HTMLElement = document.querySelector(".bg");
  currObj = this;
  constructor(socket: ReturnType<typeof io>, room: string, game: GameLogicInterface, playerTurn: boolean) {
    super(socket, room) 
    this.game = game 
    this.playerTurn = playerTurn
    this.board.className = this.playerTurn? "boardPlayerTwo" : "boardPlayerTwo turn"
    this.board.addEventListener("click", this.attack.bind(this.currObj));
    this.socket.on("turn", () => this.changeTurn());
    this.socket.on("finish", () => {this.finishModal.classList.add("show");this.backGround.classList.add("show")});
    if(!this.playerTurn) {
      console.log("another player turn")
      this.getAttacked();
      this.clearCurrentAttack(this.cellsPlayerTwo);
    }
  } 

  public attack(e: Event) {
    const el = e.target as HTMLElement
    console.log(el)
    if (this.playerTurn && el.classList[0]==="cell") {
      this.socket.emit('checkForShip', { x: el.dataset.cord[1], y: el.dataset.cord[0], room: this.room })

      this.socket.on('missed', () => {
        console.log("missed")
        el.classList.add('attacked')
        this.socket.emit('changeTurn', { socketId: this.socket.id, room:this.room })

      })
      this.socket.on('attacked', () => {
        console.log("attacked")
        el.classList.add('attackedShip')
        this.socket.off('attacked')
        this.socket.off('missed')
      })
    }
  }
  public getAttacked() {
    this.socket.on('getAttacked', (cords:{y:string,x:string}) => {
      const {y,x} = cords 
      const result = this.game.attackShip(+y,+x)
      this.socket.off("missed")
      this.socket.off("attacked")
      console.log(this)
      if(result === true) {
        if(this.game.isGameOver()) {
          console.log("finish")
          this.socket.emit("finishGame", {room:this.room})
        } else {
          this.socket.emit("gotAttacked_True", {y,x, room: this.room }) 
        }
      } else {
        this.socket.emit("gotAttacked_False", {y,x, room: this.room })
      }
  })

  }
  changeTurn() {
    console.log('w')
    this.socket.off('missed')
    this.socket.off('attacked')
    this.socket.off('getAttacked')
    this.clearCurrentAttack(this.cellsPlayerTwo)
    this.playerTurn = !this.playerTurn;
    if(this.playerTurn===false) {
      this.getAttacked();
      this.board.className = "boardPlayerTwo turn"
    } else {
      this.board.className = "boardPlayerTwo"
    }
      
  }
  clearCurrentAttack(enemyCells) {
    enemyCells.forEach((enemyCell) => {
      enemyCell.removeEventListener('click', this.attack)
    })
  }
}
