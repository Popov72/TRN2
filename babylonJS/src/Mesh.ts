import { 
    AbstractMesh,
    BoundingInfo,
    MultiMaterial,
    ShaderMaterial,
    Vector3, 
    Quaternion as BQuaternion
} from "babylonjs";

import { IMesh } from "../../src/Proxy/IMesh";
import { Position, Quaternion } from "../../src/Proxy/INode";
import { Box3 } from "../../src/Utils/Box3";
import { Behaviour } from "../../src/Behaviour/Behaviour";

import Material from "./Material";

//const  rotY180 = new BQuaternion(0, -1, 0, 0); // x <=> -x

export default class Mesh implements IMesh {

    public behaviours:      Array<Behaviour>;

    protected _materials:   Array<Material>;
    protected _mesh:        AbstractMesh;
    protected _visible:     boolean;

    constructor(obj: AbstractMesh) {
        this._mesh = obj;
        this.behaviours = [];
        this._materials = [];
        this._visible = true;

        if (obj.material instanceof MultiMaterial) {
            for (let m = 0; m < obj.material.subMaterials.length; ++m) {
                this._materials.push(new Material(obj.material.subMaterials[m] as ShaderMaterial));
            }
        }
    }

    get object(): AbstractMesh {
        return this._mesh
    }
    
    get materials(): Array<Material> {
        return this._materials;
    }

    set materials(mat: Array<Material>) {
        this._materials = mat;

        const objmat = this._mesh.material = new MultiMaterial(this._mesh.name, this._mesh.getScene());

        objmat.subMaterials = [];

        mat.forEach((m) => objmat.subMaterials.push(m.material));
    }

    public get position(): Position {
        return [this._mesh.position.x, this._mesh.position.y, this._mesh.position.z];
    }

    public setPosition(pos: Position): void {
        this._mesh.position.set(...pos);
    }

    public get quaternion(): Quaternion {
        //let q = this.obj.rotationQuaternion!.multiply(rotY180);
        //return [q.x, q.y, q.z, q.w];
        return [this._mesh.rotationQuaternion!.x, this._mesh.rotationQuaternion!.y, this._mesh.rotationQuaternion!.z, this._mesh.rotationQuaternion!.w];
    }

    public setQuaternion(quat: Quaternion): void {
        //this.obj.rotationQuaternion = new BQuaternion(...quat).multiply(rotY180);
        this._mesh.rotationQuaternion!.set(...quat);
    }

    get matrixAutoUpdate(): boolean {
        return true;
    }

    set matrixAutoUpdate(b: boolean) {
    }

    get name(): string {
        return this._mesh.name;
    }

    set name(n: string) {
        this._mesh.name = n;
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(v: boolean) {
        this._mesh.setEnabled(v);
        this._visible = v;
    }

    get renderOrder(): number {
        return this._mesh.renderingGroupId;
    }

    set renderOrder(ro: number) {
        this._mesh.renderingGroupId = ro;
    }

    public updateMatrixWorld(): void {
        this._mesh.computeWorldMatrix();
    }

    public containsPoint(pos: Position): boolean {
        return this._mesh.getBoundingInfo().boundingBox.intersectsPoint(new Vector3(pos[0], pos[1], pos[2]));
    }

    public showBoundingBox(show: boolean): void {
        this._mesh.showBoundingBox = show;
    }

    public clone(): Mesh {
        return new Mesh(this._mesh.clone(this._mesh.name, null as any) as AbstractMesh);
    }

    public setBoundingBox(box: Box3): void {
        const boundingInfo = new BoundingInfo(new Vector3(box.min[0], box.min[1], box.min[2]), new Vector3(box.max[0], box.max[1], box.max[2]), this._mesh.getWorldMatrix());
        this._mesh.setBoundingInfo(boundingInfo);
    }

    public getBoundingBox(): Box3 {
        const boundingInfo = this._mesh.getBoundingInfo(),
              boundingBox = boundingInfo.boundingBox;

        return new Box3([boundingBox.minimum.x, boundingBox.minimum.y, boundingBox.minimum.z], [boundingInfo.maximum.x, boundingInfo.maximum.y, boundingInfo.maximum.z]);
    }

}
