import { PerspectiveCamera } from "three";

import { ICamera } from "../../src/Proxy/ICamera";
import { Behaviour } from "../../src/Behaviour/Behaviour";

import Mesh from "./Mesh";

export default class Camera extends Mesh implements ICamera {

    public behaviours: Array<Behaviour>;
    
    protected camera: PerspectiveCamera;

    constructor(camera: PerspectiveCamera) {
        super(camera);

        this.camera = camera;
        this.behaviours = [];
    }

    get object(): PerspectiveCamera {
        return this.camera;
    }
    
    get aspect(): number {
        return this.camera.aspect;
    }

    set aspect(a: number) {
        this.camera.aspect = a;
    }

    public updateProjectionMatrix(): void {
        this.camera.updateProjectionMatrix();
    }
}
