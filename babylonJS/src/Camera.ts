import { 
    Quaternion as BQuaternion,
    TargetCamera,
    Vector3
} from "babylonjs";

import { Behaviour } from "../../src/Behaviour/Behaviour";
import { ICamera } from "../../src/Proxy/ICamera";
import { Position, Quaternion } from "../../src/Proxy/INode";

const rotY180 = BQuaternion.RotationAxis(new Vector3(0,1,0), Math.PI); // x <=> -x
const cstConvert = Math.PI / 180.0;

export default class Camera implements ICamera {

    public behaviours: Array<Behaviour>;

    protected _camera: TargetCamera;

    constructor(camera: TargetCamera) {
        this._camera = camera;
        this.behaviours = [];
    }

    get object(): TargetCamera {
        return this._camera;
    }
    
    public get position(): Position {
        return [this._camera.position.x, this._camera.position.y, this._camera.position.z];
    }

    public setPosition(pos: Position): void {
        this._camera.position.set(...pos);
    }

    public get quaternion(): Quaternion {
        let q = this._camera.rotationQuaternion.multiply(rotY180);
        return [q.x, q.y, q.z, q.w];
        //return [this.camera.rotationQuaternion.x, this.camera.rotationQuaternion.y, this.camera.rotationQuaternion.z, this.camera.rotationQuaternion.w];
    }
    public setQuaternion(quat: Quaternion): void {
        this._camera.rotationQuaternion = new BQuaternion(...quat).multiply(rotY180);
        //this.camera.rotationQuaternion.set(...quat);
    }

    get aspect(): number {
        return 1;
    }

    set aspect(a: number) {
    }

    get fov(): number {
        return this._camera.fov / cstConvert;
    }

    set fov(f: number) {
        this._camera.fov = f * cstConvert;
    }

    public updateMatrixWorld(): void {
        this._camera.computeWorldMatrix();
    }

    public updateProjectionMatrix(): void {
    }

    public lookAt(pos: Position): void {
        this._camera.setTarget(new Vector3(...pos));
    }
}
