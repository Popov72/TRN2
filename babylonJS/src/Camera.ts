import { 
    Quaternion as BQuaternion,
    TargetCamera,
    Vector3
} from "babylonjs";

import { Position, Quaternion } from "../../src/Proxy/IMesh";
import { ICamera } from "../../src/Proxy/ICamera";
import { Behaviour } from "../../src/Behaviour/Behaviour";

const  rotY180 = BQuaternion.RotationAxis(new Vector3(0,1,0), Math.PI);//new BQuaternion(0, -1, 0, 0); // x <=> -x

export default class Camera implements ICamera {

    public behaviours: Array<Behaviour>;

    protected camera: TargetCamera;

    constructor(camera: TargetCamera) {
        this.camera = camera;
        this.behaviours = [];
    }

    get object(): TargetCamera {
        return this.camera;
    }
    
    public get position(): Position {
        return [this.camera.position.x, this.camera.position.y, this.camera.position.z];
    }

    public setPosition(pos: Position): void {
        this.camera.position.set(...pos);
    }

    public get quaternion(): Quaternion {
        let q = this.camera.rotationQuaternion.multiply(rotY180);
        return [q.x, q.y, q.z, q.w];
        //return [this.camera.rotationQuaternion.x, this.camera.rotationQuaternion.y, this.camera.rotationQuaternion.z, this.camera.rotationQuaternion.w];
    }
    public setQuaternion(quat: Quaternion): void {
        this.camera.rotationQuaternion = new BQuaternion(...quat).multiply(rotY180);
        //this.camera.rotationQuaternion.set(...quat);
    }

    get aspect(): number {
        return 1;
    }

    set aspect(a: number) {
    }

    public updateMatrixWorld(): void {
        this.camera.computeWorldMatrix();
    }

    public updateProjectionMatrix(): void {
        //!this.camera.updateProjectionMatrix();
    }
}
