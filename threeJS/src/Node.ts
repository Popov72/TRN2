import { 
    Object3D
} from "three";

import { INode, Position, Quaternion } from "../../src/Proxy/INode";
import { Behaviour } from "../../src/Behaviour/Behaviour";

export default class Node implements INode {

    public behaviours:      Array<Behaviour>;

    protected _obj:         Object3D;
    protected _children:    Array<Node>;

    get object(): Object3D {
        return this._obj
    }
    
    constructor(obj?: Object3D) {
        this._obj = obj ? obj : new Object3D();
        this._children = [];
        this.behaviours = [];
    }

    public get position(): Position {
        return [this._obj.position.x, this._obj.position.y, this._obj.position.z];
    }

    public setPosition(pos: Position): void {
        this._obj.position.set(...pos);
    }

    public get quaternion(): Quaternion {
        return [this._obj.quaternion.x, this._obj.quaternion.y, this._obj.quaternion.z, this._obj.quaternion.w];
    }
    public setQuaternion(quat: Quaternion): void {
        this._obj.quaternion.set(...quat);
    }

    get matrixAutoUpdate(): boolean {
        return this._obj.matrixAutoUpdate;
    }

    set matrixAutoUpdate(b: boolean) {
        this._obj.updateMatrix();
        this._obj.matrixAutoUpdate = b;
    }

    get name(): string {
        return this._obj.name;
    }

    set name(n: string) {
        this._obj.name = n;
    }

    get visible(): boolean {
        return this._obj.visible;
    }

    set visible(v: boolean) {
        this._obj.visible = v;
    }

    get renderOrder(): number {
        return this._obj.renderOrder;
    }

    set renderOrder(ro: number) {
        this._obj.renderOrder = ro;
    }

    public add(child: Node): void {
        this._obj.add(child._obj);
        this._children.push(child);
    }

    public remove(child: Node): void {
		const index = this._children.indexOf(child);

        if (index !== - 1) {
			this._children.splice(index, 1);
            this._obj.remove(child._obj);
        }
    }

    public traverse( callback: (obj: Node) => void ): void {
		for (let i = 0; i < this._children.length; i ++ ) {
            const child = this._children[i];
            callback(child);
            child.traverse(callback);
		}
    }

    public getObjectByName(name: string): Node | undefined {
		if (this._obj.name === name) {
            return this;
        }

		for (let i = 0; i < this._children.length; ++i) {
			const child = this._children[i],
			      object = child.getObjectByName(name);

			if (object !== undefined) {
				return object;
			}
		}

		return undefined;
    }

    public updateMatrixWorld(): void {
        this._obj.updateMatrixWorld(true);
    }

    public clone(): Node {
        return new Node(this._obj.clone());
    }

    public matrixWorldToArray(arr: Float32Array, ofst: number): void {
        this._obj.matrixWorld.toArray(arr, ofst);
    }

}
