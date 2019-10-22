import { Position, Quaternion } from "../Proxy/INode";
import { Box3 } from "../Utils/Box3";

interface KeyData {
    "position":     Position;
    "quaternion":   Quaternion;
}

export default class Key {

    public data: Array<KeyData>;

    constructor(public time: number, public boundingBox: Box3) {
        this.data = [];
    }

    public addData(pos: Position, rot: Quaternion): void {
        this.data.push({
            "position": 	pos,
            "quaternion":   rot,
        });
    }
}
