import { 
    Box3 as TBox3,
    Box3Helper,
    Mesh as TMesh, 
    Object3D, 
    ShaderMaterial, 
    Vector3
} from "three";

import { IMesh } from "../../src/Proxy/IMesh";
import { Position } from "../../src/Proxy/INode";
import { Box3 } from "../../src/Utils/Box3";

import Material from "./Material";
import Node from "./Node";

export default class Mesh extends Node implements IMesh {

    protected _materials:   Array<Material>;
    protected _boundingBox: Box3Helper | null;

    constructor(obj: Object3D) {
        super(obj);

        this._materials = [];
        this._boundingBox = null;

        if (obj instanceof TMesh && Array.isArray(obj.material)) {
            for (let m = 0; m < obj.material.length; ++m) {
                this._materials.push(new Material(obj.material[m] as ShaderMaterial));
            }
        }
    }

    get materials(): Array<Material> {
        return this._materials;
    }

    set materials(mat: Array<Material>) {
        this._materials = mat;
        if (this.object instanceof TMesh) {
            const mesh: TMesh = this.object;
            mesh.material = [];
            mat.forEach((m) => (mesh.material as Array<ShaderMaterial>).push(m.material));
        }
    }

    public containsPoint(pos: Position): boolean {
        if (this.object instanceof TMesh) {
            return this.object.geometry.boundingBox.containsPoint(new Vector3(...pos));
        }

        return false;
    }

    public showBoundingBox(show: boolean): void {
        if (!this._boundingBox && this.object instanceof TMesh) {
            this._boundingBox = new Box3Helper(this.object.geometry.boundingBox);
            this._boundingBox.name = this.object.name + '_box';
            this._obj.add(this._boundingBox);
        }

        if (this._boundingBox !== null) {
            this._boundingBox.visible = show;
        }
    }

    public clone(): Mesh {
        return new Mesh(this.object.clone());
    }

    public setBoundingBox(box: Box3): void {
        if (this._obj instanceof TMesh) {
            const boundingBox = new TBox3(new Vector3(box.min[0], box.min[1], box.min[2]), new Vector3(box.max[0], box.max[1], box.max[2]));
            boundingBox.getBoundingSphere(this._obj.geometry.boundingSphere);
            this._obj.geometry.boundingBox = boundingBox;
            if (this._boundingBox !== null) {
                this._boundingBox.box = boundingBox;
            }
        }
    }

}
