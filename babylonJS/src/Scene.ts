import {
    Scene as BScene,
    Color4
} from "babylonjs";

import { IScene, TextureList } from "../../src/Proxy/IScene";

import Camera from "./Camera";
import Mesh from "./Mesh";

export default class Scene implements IScene {

    public textures:        TextureList | undefined;

    protected _scene:       BScene;
    protected _children:    Array<Mesh>;
    protected _camera:      Camera;

    constructor(scene: BScene, textures?: TextureList) {
        this._scene = scene;
        this._children = [];
        this.textures = textures;
        this._scene.clearColor = new Color4(0, 0, 0, 1);
        this._camera = <any>null;
    }

    get totalNumObjects(): number {
        return this._scene.getActiveMeshes().length;
    }

    get object(): BScene {
        return this._scene;
    }

    get allMeshesReady(): boolean {
        for (let i = 0; i < this._scene.meshes.length; ++i) {
            if (!this._scene.meshes[i].isReady()) {
                return false;
            }
        }

        return true;
    }

    public traverse(callback: (obj: Mesh) => void): void {
        for (let i = 0; i < this._children.length; i ++) {
            const child = this._children[i];
            callback(child);
        }
    }

    public add(obj: Mesh): void {
        if (this._scene.meshes.indexOf(obj.object) < 0) {
            this._scene.addMesh(obj.object);
        }
        this._children.push(obj);
    }

    public remove(obj: Mesh): void {
        const index = this._children.indexOf(obj);

        if (index !== - 1) {
            this._children.splice(index, 1);
        }
        this._scene.removeMesh(obj.object);
    }

    public setCamera(camera: Camera): void {
        this._camera = camera;
    }

    public getCamera(): Camera {
        return this._camera;
    }

    public getObjectByName(name: string): Mesh | undefined {
        for (let i = 0; i < this._children.length; ++i) {
            const child = this._children[i];

            if (child.name === name) {
                return child;
            }
        }

        return undefined;
    }

}
