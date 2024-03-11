interface Ship {
  x: number
  y: number
  direction: string
  startCord: number
  endCord: number
  id: number
  allShipCords: number[]
}

interface ShipType {
  type: number[]
  direction: string
}

interface GameLogicInterface {
  existingShips: Ship[]
  map: number[][]
  appendShip(ship: Ship): void
  attackShip(x: number, y: number): boolean
  checkIfShipExists(): boolean
  checkForBarriers(cords: string, shipType: ShipType): boolean
  removeShip(shipId: number): void
  createShip(x: number, y: number, ship: ShipType): Ship
  checkForShip(x: string, y: string): boolean
}
