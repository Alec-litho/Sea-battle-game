import { Game } from './Game.js'
// import { io } from 'socket.io-client';
// import { GameLogic } from './GameLogic';

export class PrepareStage extends Game {
  board: HTMLElement = document.querySelector('.board');
  direction: string = "horizontal"
  shipsHTML: NodeListOf<HTMLElement> = document.querySelectorAll('.shipToPut');
  turnAround:HTMLElement = document.querySelector(".turnAround");
  finishBTN = document.querySelector('.btn') as HTMLElement;
  shipsCount: number[] = [0, 0, 0, 0] //[0 (one cell ship),0 (two cells ship), etc...]
  game: GameLogicInterface;
  shipType: ShipType;
  shipTypeList: number[][] = [[2], [2, 2], [2, 2, 2], [2, 2, 2, 2]];
  render: ReturnType<typeof setInterval>;
  isDragging:boolean = false
  currentCell: HTMLElement
  constructor(socket: any/*ReturnType<typeof io>*/ , room: string, gameLogic: GameLogicInterface) {
    super(socket, room)
    this.shipType = {
      type: this.shipTypeList[0],
      direction: this.direction
    }
    this.game = gameLogic
    this.render = setInterval(() => this.renderShips(), 300)
    this.finishBTN.addEventListener("click", () => this.finishPrepareStage())
    this.removeStyles()
    this.turnAround.addEventListener("click", () => this.changeDirectionHTML())
    window.onmouseup = (e) => console.log(e,e.target)
    this.board.addEventListener("dragover",(e) => {
      const el = e.target as HTMLElement
      if(this.isDragging && (el.classList[0]==="cell")) {
        this.currentCell = el
        this.game.paintShipArea(el.dataset.cord, this.shipType, this.cellsPlayerOne)
      }
    })
    this.cellsPlayerOne.forEach(cell => {
      cell.addEventListener("dragleave",() => {
        this.game.clearShipArea(this.cellsPlayerOne)
      })
    })
    this.shipsHTML.forEach(ship => {
      ship.addEventListener("dragstart", (e) => {
        this.isDragging = true
        this.chooseShip(e)
      })
      ship.addEventListener("dragend", () => {
        this.isDragging = false
        this.placeShip()
      })
    })
  }
  private removeStyles() {
    function qselect(HTMLclass):HTMLDivElement {return document.querySelector(HTMLclass)}//wanted to make it shorter
    const [game, gameContainer, startGame] = [qselect('.game'),qselect('.gameContainer'),qselect('.startGame')] 
    game.style.display = 'flex'
    gameContainer.style.display = 'flex'
    startGame.style.display = 'none'
  }
  public clearEvents(): void {
    this.shipsHTML.forEach(() => {
    })
  }
  public chooseShip(e: Event): void {
    const target = e.target as HTMLElement
    const num = +target.dataset.num
    console.log(num, num-1,this.shipTypeList)
    this.shipType.type = this.shipTypeList[num-1]
    const shipsToPut = target.parentNode.childNodes as NodeListOf<HTMLElement>
    shipsToPut.forEach(el => {if(el.className==="shipToPut") el.style.border = "3px solid rgb(42, 113, 146)"})
    target.style.border = "3px solid rgb(122, 208, 248)"
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
  public placeShip(): void {
    const target = this.currentCell as HTMLElement
    const { x, y } = { x: target.dataset.cord[1], y: target.dataset.cord[0] }
    const cords = y.toString() + x.toString()
    if (this.game.checkForShip(x, y)) {
      console.log(`exists`, this.game.existingShips)
    } else if (this.game.checkForBarriers(cords, this.shipType)) {
      console.log('cant place it here')
    } else {
      const ship = this.game.createShip(Number.parseFloat(y), Number.parseFloat(x), this.shipType)
      this.game.appendShip(ship)
      this.incrementShipCount()
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
    if (this.shipsCount.reduce((a: number, b: number) => a + b, 0) !== 10) {
      this.updateShipsDOM(this.shipsCount)
    }

  }
  public setCurrentShip() {
    //fix id setting//----------------------------------------------------------------------------------------
    const id = this.shipType.type.length == 1 ? '1' : this.shipType.type.length == 2 ? '2' : this.shipType.type.length == 3 ? '3' : '4'
    const shipsToPut = document.querySelectorAll('.shipToPut') as NodeListOf<HTMLElement>
    [...shipsToPut].filter(shipHTML => shipHTML.dataset.num === id)[0].style.border = "3px solid rgb(122, 208, 248)"
    //----------------------------------------------------------------------------------------
  }

  public updateShipsDOM(arr: number[]) {
    arr.forEach((ship: number, indx: number) => {
      if (ship === arr.length - indx) {
        const htmlEl = [...this.shipsHTML].filter((el: HTMLElement) => el.getAttribute('id') === `${indx + 1}`)[0]
        console.log(ship, htmlEl)
        htmlEl.classList.add('hide')
        this.shipTypeList.splice(indx, 1, null) //remove a ship type that we have run out of
        if (this.shipTypeList.length === 1) this.shipType.type = this.shipTypeList[0]
        else {
          this.shipTypeList.forEach((ship:number[]|null,indx:number, shipList) => {
            if(shipList[indx+1]===undefined) this.shipType.type = shipList[0];
            if(ship!==null) this.shipType.type = ship
          })
        }
        // else this.shipType.type = this.shipTypeList[indx + 1] === undefined ? this.shipTypeList[0] : this.shipTypeList[indx + 1]
      }
    })
    this.setCurrentShip()
  }
  public changeDirectionHTML() {
    const oldDir = this.direction;
    this.direction = this.direction === "horizontal"? "vertical" : "horizontal";
    this.shipType.direction = this.direction;
    const ships = document.querySelector(`.ships`);
    ships.classList.remove(`ships`,`${oldDir}`);
    ships.classList.add(`ships`,`${this.direction}`);
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
