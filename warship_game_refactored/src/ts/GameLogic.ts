import Ship from "./Ship.js";

export class GameLogic implements GameLogicInterface {
  public existingShips: IShip[] = []
  public map: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ]
  public ShipClass: typeof Ship;
  constructor() {
    this.ShipClass = Ship
  }

  public appendShip(ship: IShip): void {
    const shipCords = ship.allShipCords
    //find out if there is a way to not iterate through whole map to place a ship
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (shipCords.some((cord) => +cord[0] === y) && shipCords.some((cord) => +cord[1] === x)) {
          this.map[y][x] = 2        
        }
      }
    }
    //-------------------------------------------------------------------
  }
  public attackShip(y: number, x: number): boolean {
    if (this.map[y][x] === 2) {
      this.existingShips.forEach((ship: IShip) => {
        ship.allShipCords.map((cord: number, indx: number) => {
          if (cord.toString() === `${y} + ${x}`) ship.allShipCords.splice(indx, 1)
        })
      })
      this.map[y][x] = 1
      if (this.checkIfShipExists()) {
        const shipId = this.existingShips.filter((ship) => ship.allShipCords.length === 0)[0].id
        this.removeShip(shipId)
      }
      return true
    } else {
      return false
    }
  }
  public checkIfShipExists(): boolean {
    let result: boolean
    this.existingShips.forEach((ship) => {
      result = ship.allShipCords.length > 0 ? true : false
    })
    return result
  }
  public checkForShip(y: string, x: string): boolean {
    if (this.existingShips.length > 0) {
      return [...this.existingShips].some((ship) => {
        ship.allShipCords.forEach((cord: number) => (cord == Number.parseFloat(y+x) ? true : false))
      })
    } else {
      return false
    }
  }
  public paintShipArea(cords: string, shipType: ShipType, cells:HTMLElement[]) {
    const {startCord, endCord} = this.defineStartAndEndCords(cords, shipType)
    // const sliceOfCells = cells.slice(+areaCords[0],+areaCords[areaCords.length])
    // console.log(startCord, endCord)
    for (let y = +startCord[0]; y <= +endCord[0]; y++) {
      if(Math.sign(y)===-1) continue
      for (let x = +startCord[1]; x <= +endCord[1]; x++) {
        if(Math.sign(x)===-1) continue
        const indx = y===0? +`${x}` : +`${y}${x}`
        if (this.map[y][x] === 2) {
          cells[indx].className = "cell barrier"
        } else {
          cells[indx].className = "cell freeSpace"
        }
      }
    }
  }
  public clearShipArea(cells:HTMLElement[]) {
    cells.forEach((cell) => {
      cell.className = cell.className === "cell ship"? "cell ship" : "cell "
    })
  }
  public checkForBarriers(cords: string, shipType: ShipType): boolean {
    const {startCord, endCord} = this.defineStartAndEndCords(cords, shipType)

    for (let y = +startCord[0]; y <= +endCord[0]; y++) {
      if(Math.sign(+startCord[0])===-1) continue
      for (let x = +startCord[1]; x <= +endCord[1]; x++) {
        if(Math.sign(+startCord[1])===-1) continue
        if (this.map[y][x] === 2) {
          console.log('barrier')
          return true
        }
      }
    }
  }
  public defineStartAndEndCords(cords: string, shipType: ShipType):{startCord:string[], endCord:string[]} {
    const shipTypeLen = shipType.type.length
    let currCord: number = +cords[0]
    const startCord: string[] = []
    const endCord: string[] = []

      let y = `${+cords[0] * 10 - 10}`
      const x = `${+cords[1] - 1}`
      y.length === 3 ? (y = y.slice(0, 2)) : (y = y.slice(0, 1))
      startCord.push(y.toString(), x)
    
    currCord === 9 ? (currCord = currCord - 1) : currCord
    if(shipType.direction === 'horizontal' ) {
      const sumY = ((+startCord[0])+2)*10
      const sumX = (+startCord[1])+shipTypeLen+1
      let sum = sumY + sumX
      if(sum.toString().length === 3) sum = sum-10;
      if(sumX===10) sum -= 1
      endCord.push(`${sum.toString()[0]}`, `${sum.toString()[1]}`);
    } else {
      const sumY = (+startCord[1])+2
      const sumX = ((+startCord[0])+shipTypeLen+1)*10
      let sum = sumY + sumX
      if(sum.toString().length === 3) sum = sum-10;
      if(sumY===10) sum -= 1
      endCord.push(`${sum.toString()[0]}`, `${sum.toString()[1]}`);
    }
  
   return {startCord,endCord}
  }

  public removeShip(shipId: number) {
    let shipIndx: number
    this.existingShips.forEach((ship, indx) => {
      if (ship.id === shipId) shipIndx = indx
    })
    this.existingShips = this.existingShips.splice(shipIndx, 1)
  }
  public createShip(y: number, x: number, ship: ShipType) {
    const createdShip = new this.ShipClass(y,x, ship)
    this.existingShips.push(createdShip)
    return createdShip
  }
}
