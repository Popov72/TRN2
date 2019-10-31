import {
    Quaternion as BQuaternion,
    TransformNode,
    Vector3
} from "babylonjs";

import { INode, Position, Quaternion } from "../../src/Proxy/INode";

//const  rotY180 = new BQuaternion(0, -1, 0, 0); // x <=> -x

export default class Node implements INode {

    protected _node:        TransformNode;
    protected _children:    Array<Node>;

    constructor(obj?: TransformNode, name?: string, scene?: Scene) {
        this._node = obj ? obj : new TransformNode(name ? name : "unnamed Node", scene ? scene.object : null);
        this._children = [];
        this._node.rotationQuaternion = new BQuaternion();
    }

    get object(): TransformNode {
        return this._node;
    }

    public get position(): Position {
        return [this._node.position.x, this._node.position.y, this._node.position.z];
    }

    public setPosition(pos: Position): void {
        this._node.position.set(...pos);
    }

    public get quaternion(): Quaternion {
        return [this._node.rotationQuaternion!.x, this._node.rotationQuaternion!.y, this._node.rotationQuaternion!.z, this._node.rotationQuaternion!.w];
    }

    public setQuaternion(quat: Quaternion): void {
        this._node.rotationQuaternion!.set(...quat);
    }

    public add(child: Node): void {
        child.object.parent = this._node;
        this._children.push(child);
    }

    public remove(child: Node): void {
        const index = this._children.indexOf(child);

        if (index !== - 1) {
            this._children.splice(index, 1);
            child.object.parent = null;
        }
    }

    public updateMatrixWorld(): void {
        this._node.computeWorldMatrix(true);
    }

    public matrixWorldToArray(arr: Float32Array, ofst: number): void {
        arr.set(this._node.getWorldMatrix().toArray(), ofst);
    }

    public decomposeMatrixWorld(pos: Position, quat: Quaternion): void {
        const _pos = new Vector3(), _quat = new BQuaternion(), _scale = new Vector3();

        this._node.getWorldMatrix().decompose(_scale, _quat, _pos);

        pos[0] = _pos.x;    pos[1] = _pos.y;    pos[2] = _pos.z;
        quat[0] = _quat.x;  quat[1] = _quat.y;  quat[2] = _quat.z;  quat[3] = _quat.w;
    }

}
