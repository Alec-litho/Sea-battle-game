import { Game } from './Game'
import { io } from 'socket.io-client'

export class GameplayStage extends Game {
  public playerTurn: string
  game: GameLogicInterface

  constructor(socket:ReturnType<typeof io>, room:string, game: GameLogicInterface, playerTurn: string) {
    super(socket, room)
    this.game = game
    this.playerTurn = playerTurn
  }

  public attack(e: Event) {
    const cell = e.target as HTMLElement
    this.socket.emit('checkForShip', { x: cell.dataset.cord[1], y: cell.dataset.cord[0], room: this.room })

    this.socket.on('missed', () => {
      cell.classList.add('attacked')
      this.changeTurn()
    })
    this.socket.on('attacked', () => {
      cell.classList.add('attackedShip')
      this.socket.off('attacked')
      this.socket.off('missed')
    })
  }
  changeTurn() {  
    this.socket.off("missed")
    this.socket.off("attacked")
    this.socket.off("getAttacked")                  
    this.clearCurrentAttack(this.cellsPlayerTwo)
    this.socket.emit('changeTurn', {socketId:this.socket.id})
  }
  clearCurrentAttack(enemyCells) {
    enemyCells.forEach(enemyCell => {
        enemyCell.removeEventListener('click', this.attack)
    })
  }
}
