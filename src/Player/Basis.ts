import { Position, Quaternion } from "../Proxy/INode";

declare var glMatrix: any;

export class Basis {

    public rot: Quaternion;
    public pos: Position;

    constructor(pos?: Position, quat?: Quaternion) {
        this.pos = pos ? pos : [0, 0, 0];
        this.rot = quat ? quat : [0, 0, 0, 1];
    }

    public identity(): void {
        this.rot = [0, 0, 0, 1];
        this.pos = [0, 0, 0];
    }

    public multBasis(basis: Basis): Basis {
        const q: Quaternion = [0, 0, 0, 1], p: Position = [0, 0, 0];

        glMatrix.quat.mul(q, this.rot, basis.rot);
        glMatrix.vec3.transformQuat(p, basis.pos, this.rot);

        p[0] += this.pos[0];
        p[1] += this.pos[1];
        p[2] += this.pos[2];

        return new Basis(p, q);
    }

    public mult(v: Position): Position {
        const p: Position = [0, 0, 0];

        glMatrix.vec3.transformQuat(p, v, this.rot);

        p[0] += this.pos[0];
        p[1] += this.pos[1];
        p[2] += this.pos[2];

        return p;
    }

    public translate(v: Position): void {
        const p: Position = [0, 0, 0];

        glMatrix.vec3.transformQuat(p, v, this.rot);

        this.pos[0] += p[0];
        this.pos[1] += p[1];
        this.pos[2] += p[2];
    }

    public rotate(q: Quaternion): void {
        glMatrix.quat.mul(this.rot, this.rot, q);
    }
}
