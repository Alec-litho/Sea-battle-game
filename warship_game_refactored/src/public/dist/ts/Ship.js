"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ship {
    constructor(yCord, xCord, shipType) {
        this.x = xCord;
        this.y = yCord;
        this.direction = shipType.direction;
        this.type = shipType.type;
        this.id = Math.floor(Math.random() * 255);
        this.startCord = `${yCord}` + `${xCord}`;
        this.endCord = this.direction === "horizontal" ? this.startCord[0] + ((+this.startCord[1]) + this.type.length - 1) : ((+this.startCord[0]) + this.type.length - 1) + this.startCord[1];
        this.allShipCords = this.setShipCords();
    }
    setShipCords() {
        const lengthCords = [];
        let extendingCord = this.direction === 'horizontal' ? (+this.startCord[1]) - 1 : (+this.startCord[0]) - 1;
        if (this.direction === 'horizontal') {
            while (extendingCord < (+this.endCord[1])) {
                lengthCords.push(this.startCord[0] + (++extendingCord));
            }
        }
        else {
            while (extendingCord < (+this.endCord[0])) {
                lengthCords.push((++extendingCord) + this.startCord[1]);
            }
        }
        return lengthCords;
    }
}
exports.default = Ship;
