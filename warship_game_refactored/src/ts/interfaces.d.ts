interface IShip {
  x: number
  y: number
  direction: string
  startCord: string
  endCord: string
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
  createShip(y: number, x: number, ship: ShipType): IShip
  checkForShip(x: string, y: string): boolean
  clearShipArea(cells:HTMLElement[]):void
  paintShipArea(cords: string, shipType: ShipType, cells:HTMLElement[]):void
  defineStartAndEndCords(cords: string, shipType: ShipType):{startCord:string[], endCord:string[]}
  isGameOver():boolean
}
