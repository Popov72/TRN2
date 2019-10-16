import { 
    Box3Helper,
    Mesh as TMesh, 
    Object3D, 
    ShaderMaterial, 
    Vector3
} from "three";

import { Behaviour } from "../../src/Behaviour/Behaviour";

import { IMesh, Position, Quaternion } from "../../src/Proxy/IMesh";
import Material from "./Material";

export default class Mesh implements IMesh {

    public materials: Array<Material>;
    public behaviours: Array<Behaviour>;

    protected obj: Object3D;
    protected children: Array<Mesh>;

    private boundingBox: Box3Helper;

    get object(): Object3D {
        return this.obj
    }
    
    constructor(obj: Object3D) {
        this.obj = obj;
        this.children = [];
        this.behaviours = [];
        this.materials = [];
        this.boundingBox = <any>null;

        if (obj instanceof TMesh && Array.isArray(obj.material)) {
            for (let m = 0; m < obj.material.length; ++m) {
                this.materials.push(new Material(obj, obj.material[m] as ShaderMaterial));
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
        return [this.obj.quaternion.x, this.obj.quaternion.y, this.obj.quaternion.z, this.obj.quaternion.w];
    }
    public setQuaternion(quat: Quaternion): void {
        this.obj.quaternion.set(...quat);
    }

    get matrixAutoUpdate(): boolean {
        return this.obj.matrixAutoUpdate;
    }

    set matrixAutoUpdate(b: boolean) {
        this.obj.updateMatrix();
        this.obj.matrixAutoUpdate = b;
    }

    get name(): string {
        return this.obj.name;
    }

    set name(n: string) {
        this.obj.name = n;
    }

    get visible(): boolean {
        return this.obj.visible;
    }

    set visible(v: boolean) {
        this.obj.visible = v;
    }

    public traverse( callback: (obj: Mesh) => void ): void {
		callback(this);

		for (let i = 0; i < this.children.length; i ++ ) {
			this.children[i].traverse(callback);
		}
    }

    public add(child: Mesh): void {
        this.obj.add(child.obj);
        this.children.push(child);
    }

    public remove(child: Mesh): void {
		const index = this.children.indexOf(child);

        if (index !== - 1) {
			this.children.splice(index, 1);
            this.obj.remove(child.obj);
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
        this.obj.updateMatrixWorld();
    }

    public containsPoint(pos: Position): boolean {
        if (this.obj instanceof TMesh) {
            return this.obj.geometry.boundingBox.containsPoint(new Vector3(...pos));
        }

        return false;
    }

    public showBoundingBox(show: boolean): void {
        if (!this.boundingBox) {
            this.boundingBox = new Box3Helper((this.obj as TMesh).geometry.boundingBox);
            this.boundingBox.name = this.obj.name + '_box';
        }

        this.boundingBox.visible = show;
    }
}
