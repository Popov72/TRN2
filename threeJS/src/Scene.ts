import { Scene as TScene } from "three";

import { IScene, TextureList } from "../../src/Proxy/IScene";

import Mesh from "./Mesh";
import Camera from "./Camera";

export default class Scene extends Mesh implements IScene {

    public textures: TextureList | undefined;

    private camera: Camera;

    constructor(scene: TScene, textures?: TextureList) {
        super(scene);

        this.textures = textures;
        this.camera = <any>null;
    }

    public setCamera(camera: Camera): void {
        this.camera = camera;
    }

    public getCamera(): Camera {
        return this.camera;
    }

}
