import { Game } from './Game'
import { io } from 'socket.io-client';
// import { GameLogic } from './GameLogic';

export class PrepareStage extends Game {
  shipsHTML: NodeListOf<Element> = document.querySelectorAll('.shipToPut');
  finishBTN = document.querySelector('.btn') as HTMLElement;
  shipsCount: number[] = [0, 0, 0, 0] //[0 (one cell ship),0 (two cells ship), etc...]
  game: GameLogicInterface;
  shipType: ShipType;
  shipTypeList: number[][] = [[2], [2, 2], [2, 2, 2], [2, 2, 2, 2]];
  render: ReturnType<typeof setInterval>;

  constructor(socket: ReturnType<typeof io> , room: string, game: GameLogicInterface) {
    super(socket, room)
    this.shipType = {
      type: this.shipTypeList[0],
      direction: 'horizontal'
    }
    this.game = game
    this.render = setInterval(() => this.renderShips, 300)
    this.finishBTN.addEventListener("click", this.finishPrepareStage)
  }
  public clearEvents(): void {
    this.cellsPlayerOne.forEach((cells) => {
      cells.removeEventListener('click', this.placeShip)
    })
    this.cellsPlayerOne.forEach((ship) => {
      ship.removeEventListener('click', this.chooseShip)
    })
    this.cellsPlayerOne.forEach((cell) => {
      cell.removeEventListener('click', this.incrementShipCount)
    })
  }
  public chooseShip(e: Event): void {
    const target = e.target as HTMLElement
    this.shipType.type = this.shipTypeList[target.dataset.num]
  }
  public renderShips(): void {
    [...this.cellsPlayerOne].forEach((cell) => {
      for (let y = 0; y < this.game.map.length; y++) {
        for (let x = 0; x < this.game.map[y].length; x++) {
          if (this.game.map[y][x] === 2) {
            cell.dataset.cord === [y, x].join('') ? cell.classList.add('ship') : null
          }
        }
      }
    })
  }
  public placeShip(e: Event): void {
    const target = e.target as HTMLElement
    const { x, y } = { x: target.dataset[1], y: target.dataset[0] }
    const cords = y.toString() + x.toString()
    if (this.game.checkForShip(x, y)) {
      console.log(`exists`, this.game.existingShips)
    } else if (this.game.checkForBarriers(cords, this.shipType)) {
      console.log('cant place it here')
    } else {
      const ship = this.game.createShip(Number.parseFloat(x), Number.parseFloat(y), this.shipType)
      this.game.appendShip(ship)
    }
  }
  public incrementShipCount(): void {
    switch (this.shipType.type.length) {
      case 1:
        this.shipsCount[0]++
        break
      case 2:
        this.shipsCount[1]++
        break
      case 3:
        this.shipsCount[2]++
        break
      case 4:
        this.shipsCount[3]++
        break
    }
    if (this.shipsCount.reduce((a: number, b: number) => a + b, 0) >= 10) {
      const currentShip = document.querySelector('.currentShip') as HTMLElement
      currentShip.style.display = 'none'
      this.cellsPlayerOne.forEach((cell) => {
        cell.removeEventListener('click', this.placeShip)
      })
    }
    this.updateShipsDOM(this.shipsCount)
  }
  public setCurrentShip() {
    //fix id setting//----------------------------------------------------------------------------------------
    const id = this.shipType.type.length == 1 ? 'one' : this.shipType[0].length == 2 ? 'two' : this.shipType[0].length == 3 ? 'three' : 'four'
    document.querySelector('.currentShip').setAttribute('id', `${id}`)
    //----------------------------------------------------------------------------------------
  }

  public updateShipsDOM(arr: number[]) {
    arr.forEach((ship: number, indx: number) => {
      if (ship === arr.length - indx) {
        const htmlEl = [...this.shipsHTML].filter((el: HTMLElement) => el.getAttribute('id') === `${indx + 1}`)[0]
        htmlEl.classList.add('hide')
        this.shipTypeList.splice(indx, 1) //remove a ship type that we have run out of
        if (this.shipTypeList.length === 1) this.shipType.type = this.shipTypeList[0]
        else this.shipType.type = this.shipTypeList[indx + 1] === undefined ? this.shipTypeList[indx - 1] : this.shipTypeList[indx + 1]
      }
    })
    this.setCurrentShip()
  }

  public finishPrepareStage() {
    if (this.game.existingShips.length >= 10) {
      setTimeout(() => {
        clearInterval(this.render)
        this.clearEvents()
        this.socket.emit('finishedPreparing', { room: this.room })
      }, 500)
      document.querySelector<HTMLElement>('.btn').style.display = 'none'
    } else {
      console.log('some ships are not used')
    }
  }
}
