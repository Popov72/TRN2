import { PerspectiveCamera } from "three";

import { ICamera } from "../../src/Proxy/ICamera";

import Node from "./Node";

export default class Camera extends Node implements ICamera {

    protected _camera: PerspectiveCamera;

    constructor(camera: PerspectiveCamera) {
        super(camera);

        this._camera = camera;
    }

    get object(): PerspectiveCamera {
        return this._camera;
    }
    
    get aspect(): number {
        return this._camera.aspect;
    }

    set aspect(a: number) {
        this._camera.aspect = a;
    }

    public updateProjectionMatrix(): void {
        this._camera.updateProjectionMatrix();
    }
}
