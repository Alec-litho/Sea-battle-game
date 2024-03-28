import Ship from "./Ship";

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
  public ShipClass = Ship;

  public appendShip(ship: IShip): void {
    const shipCords = ship.allShipCords
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        if (shipCords.some((cord) => +cord[0] === y) && shipCords.some((cord) => +cord[1] === x)) {
          this.map[y][x] = 2
        }
      }
    }
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
  public checkForBarriers(cords: string, shipType: ShipType): boolean {
    const shipTypeLen = shipType.type.length
    let currCord: number = +cords[0]
    let startCord: string
    if (+cords[0][0] - 11 === 0 || +cords[0][1] - 11 === 0) startCord = '00'
    else {
      let y = `${+cords[0][0] * 10 - 10}`
      let x = `${+cords[0][1] - 1}`
      y.length === 3 ? (y = y.slice(0, 2)) : (y = y.slice(0, 1))
      while (Math.sign(+x) === -1) x = `${parseFloat(x) + 1}`
      while (Math.sign(+y) === -1) y = `${parseFloat(y) + 1}`
      startCord = y.toString() + x
    }
    currCord.toString().slice(1, 2) === '9' ? (currCord = currCord - 1) : currCord
    let endCord =
      shipType.direction === 'horizontal' ? `${currCord + (10 + shipTypeLen)}` : `${currCord + (shipTypeLen * 10 + 1)}`
    while (endCord.length === 3) {
      let firstSlice = endCord.slice(0, 2)
      const secondSlice = endCord.slice(2, 3)
      console.log(firstSlice, secondSlice)
      firstSlice = `${parseFloat(firstSlice) - 1}`
      endCord = firstSlice + secondSlice
    }

    for (let y = +startCord[0]; y <= +endCord[0]; y++) {
      for (let x = +startCord[1]; x <= +endCord[1]; x++) {
        console.log(y, x)
        if (this.map[y][x] === 2) {
          console.log('barrier')
          return true
        }
      }
    }
  }

  public removeShip(shipId: number) {
    let shipIndx: number
    this.existingShips.forEach((ship, indx) => {
      if (ship.id === shipId) shipIndx = indx
    })
    this.existingShips = this.existingShips.splice(shipIndx, 1)
  }
  public createShip(x: number, y: number, ship: ShipType) {
    const createdShip = new this.ShipClass(x, y, ship)
    this.existingShips.push(createdShip)
    return createdShip
  }
}
