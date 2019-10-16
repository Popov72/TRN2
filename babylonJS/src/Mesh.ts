import { 
    AbstractMesh,
    MultiMaterial,
    ShaderMaterial,
    Vector3, 
    Quaternion as BQuaternion
} from "babylonjs";

import { Behaviour } from "../../src/Behaviour/Behaviour";

import { IMesh, Position, Quaternion } from "../../src/Proxy/IMesh";
import Material from "./Material";

const  rotY180 = new BQuaternion(0, -1, 0, 0); // x <=> -x

export default class Mesh implements IMesh {

    public materials: Array<Material>;
    public behaviours: Array<Behaviour>;

    protected obj: AbstractMesh;
    protected children: Array<Mesh>;

    private _visible: boolean;

    get object(): AbstractMesh {
        return this.obj
    }
    
    constructor(obj: AbstractMesh) {
        this.obj = obj;
        this.children = [];
        this.behaviours = [];
        this.materials = [];
        this._visible = true;

        if (obj.material instanceof MultiMaterial) {
            for (let m = 0; m < obj.material.subMaterials.length; ++m) {
                this.materials.push(new Material(obj, obj.material.subMaterials[m] as ShaderMaterial));
            }
        }
    }

    public get position(): Position {
        return [this.obj.position.x, this.obj.position.y, this.obj.position.z];
    }

    public setPosition(pos: Position): void {
        this.obj.position.set(...pos);
    }

    public get quaternion(): Quaternion {
        let q = this.obj.rotationQuaternion!.multiply(rotY180);
        return [q.x, q.y, q.z, q.w];
        //return [this.obj.rotationQuaternion!.x, this.obj.rotationQuaternion!.y, this.obj.rotationQuaternion!.z, this.obj.rotationQuaternion!.w];
    }

    public setQuaternion(quat: Quaternion): void {
        this.obj.rotationQuaternion = new BQuaternion(...quat).multiply(rotY180);
        //this.obj.rotationQuaternion!.set(...quat);
    }

    get matrixAutoUpdate(): boolean {
        return true;
    }

    set matrixAutoUpdate(b: boolean) {
    }

    get name(): string {
        return this.obj.name;
    }

    set name(n: string) {
        this.obj.name = n;
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(v: boolean) {
        this.obj.setEnabled(v);
        this._visible = v;
    }

    public traverse( callback: (obj: Mesh) => void ): void {
		callback(this);

		for (let i = 0; i < this.children.length; i ++ ) {
			this.children[i].traverse(callback);
		}
    }

    public add(child: Mesh): void {
        this.obj.addChild(child.obj);
        this.children.push(child);
    }

    public remove(child: Mesh): void {
		const index = this.children.indexOf(child);

        if (index !== - 1) {
			this.children.splice(index, 1);
            this.obj.removeChild(child.obj);
		}
    }

    public getObjectByName(name: string): Mesh | undefined {
		if (this.obj.name === name) {
            return this;
        }

		for (let i = 0; i < this.children.length; ++i) {
			const child = this.children[i],
			      object = child.getObjectByName(name);

			if (object !== undefined) {
				return object;
			}
		}

		return undefined;
    }

    public updateMatrixWorld(): void {
        this.obj.computeWorldMatrix();
    }

    public containsPoint(pos: Position): boolean {
        return this.obj.getBoundingInfo().boundingBox.intersectsPoint(new Vector3(pos[0], pos[1], pos[2]));
    }

    public showBoundingBox(show: boolean): void {
        this.obj.showBoundingBox = show;
    }

}
