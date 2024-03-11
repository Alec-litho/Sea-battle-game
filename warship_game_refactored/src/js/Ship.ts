

class Ship {
    public x: number;
    public y: number;
    public direction: string;
    public type: number[];
    public id: number;
    private startCord: number;
    private endCord: number;
    public allShipCords: number[];

    constructor(xCord:number, yCord:number, shipType:ShipType) {
        this.x = xCord;
        this.y = yCord;
        this.direction = shipType.direction;
        this.type = shipType.type
        this.id = Math.floor(Math.random()*255);
        this.startCord = parseFloat(`${xCord}`+`${yCord}`)
        this.endCord = this.direction === "horizontal"? this.startCord[0] + (this.startCord[1] + this.type.length-1) : (this.startCord[0] + this.type.length-1) + this.startCord[1]
        this.allShipCords = this.setShipCords()
    }

    private setShipCords():number[] {
        const lengthCords = []
            let extendingCord = this.direction === 'horizontal'? this.startCord[1]-1 : this.startCord[0]-1//y or x depends on what we want to extend
            if(this.direction === 'horizontal') {
                while(extendingCord < this.endCord[1]) {
                    lengthCords.push(this.startCord[0] + (++extendingCord))
                }
            } else {
                while(extendingCord < this.endCord[0]) {
                    lengthCords.push((++extendingCord) + this.startCord[1] )
                }
            }
            return lengthCords
    }



}