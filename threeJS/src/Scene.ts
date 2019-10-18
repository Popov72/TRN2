import { 
    Scene as TScene 
} from "three";

import { IScene, TextureList } from "../../src/Proxy/IScene";

import Camera from "./Camera";
import Mesh from "./Mesh";
import Node from "./Node";

export default class Scene extends Node implements IScene {

    public textures:    TextureList | undefined;

    protected _camera:  Camera;

    constructor(scene: TScene, textures?: TextureList) {
        super(scene);

        this.textures = textures;
        this._camera = <any>null;
    }

    public setCamera(camera: Camera): void {
        this._camera = camera;
    }

    public getCamera(): Camera {
        return this._camera;
    }

    public traverse( callback: (obj: Mesh) => void ): void {
        super.traverse(callback as ((obj: Node) => void));
    }

    public add(child: Mesh): void {
        super.add(child);
    }

    public remove(child: Mesh): void {
        super.remove(child);
    }

    public getObjectByName(name: string): Mesh | undefined {
        return super.getObjectByName(name) as Mesh;
    }

}
