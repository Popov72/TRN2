import { Position } from "../Proxy/INode";

export class Box3 {

    protected _min: Position;
    protected _max: Position;
    
    constructor(min?: Position, max?: Position) {
        if (min !== undefined) {
            this._min = min;
        } else {
            this._min = [+Infinity, +Infinity, +Infinity];
        }

        if (max !== undefined) {
            this._max = max;
        } else {
            this._max = [-Infinity, -Infinity, -Infinity];
        }
    }

    get min(): Position {
        return this._min;
    }

    get max(): Position {
        return this._max;
    }

    public union(box: Box3): void {
        this._min[0] = Math.min(this._min[0], box._min[0]);
        this._min[1] = Math.min(this._min[1], box._min[1]);
        this._min[2] = Math.min(this._min[2], box._min[2]);

        this._max[0] = Math.max(this._max[0], box._max[0]);
        this._max[1] = Math.max(this._max[1], box._max[1]);
        this._max[2] = Math.max(this._max[2], box._max[2]);
    }
}
