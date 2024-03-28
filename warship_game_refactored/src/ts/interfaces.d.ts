interface IShip {
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
  existingShips: IShip[]
  map: number[][]
  appendShip(ship: IShip): void
  attackShip(x: number, y: number): boolean
  checkIfShipExists(): boolean
  checkForBarriers(cords: string, shipType: ShipType): boolean
  removeShip(shipId: number): void
  createShip(x: number, y: number, ship: ShipType): IShip
  checkForShip(x: string, y: string): boolean
}
