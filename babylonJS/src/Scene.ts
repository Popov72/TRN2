import { Scene as BScene, Color4 } from "babylonjs";

import { IScene, TextureList } from "../../src/Proxy/IScene";
import Camera from "./Camera";
import Mesh from "./Mesh";

export default class Scene implements IScene {

    public textures: TextureList | undefined;

    protected scene: BScene;
    protected children: Array<Mesh>;
    protected camera: Camera;

    constructor(scene: BScene, textures?: TextureList) {
        this.scene = scene;
        this.children = [];
        this.textures = textures;
        this.scene.clearColor = new Color4(0,0,0,1)
        this.camera = <any>null;
    }

    get totalNumObjects(): number {
        return this.scene.getActiveMeshes().length;
    }

    get object(): BScene {
        return this.scene;
    }

    public traverse( callback: (obj: Mesh) => void ): void {
		for (let i = 0; i < this.children.length; i ++ ) {
			this.children[i].traverse(callback);
		}
    }

    public add(obj: Mesh): void {
        if (this.scene.meshes.indexOf(obj.object) < 0) {
            this.scene.addMesh(obj.object);
        }
        this.children.push(obj);
    }

    public remove(obj: Mesh): void {
        this.scene.removeMesh(obj.object);
    }

    public setCamera(camera: Camera): void {
        this.camera = camera;
    }

    public getCamera(): Camera {
        return this.camera;
    }

    public getObjectByName(name: string): Mesh | undefined {
		for (let i = 0; i < this.children.length; ++i) {
			const child = this.children[i],
			      object = child.getObjectByName(name);

			if (object !== undefined) {
				return object;
			}
		}

		return undefined;
    }

}
