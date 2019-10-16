import { Scene as TScene, WebGLRenderer } from "three";

import { IRenderer, PerfData } from "../../src/Proxy/IRenderer";
import Camera from "./Camera";
import Scene from "./Scene";

export default class Renderer implements IRenderer {

    protected renderer: WebGLRenderer;

    constructor(container: Element) {
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.autoClear = false;

        container.appendChild(this.renderer.domElement);

        return this;
    }

    public setSize(width: number, height: number): void {
        this.renderer.setSize(width, height);
    }

    public createScene(): Scene {
        return new Scene(new TScene());
    }

    public clear(): void {
        this.renderer.clear(true, true, true);
    }

    public render(scene: Scene, camera: Camera): void {
        this.renderer.render(scene.object as TScene, camera.object);
    }
    
    public getPerfData(scenes: Array<Scene>): PerfData {
        let numDrawCalls = 0, numObjects = 0, numGeometries = 0, numFaces = 0, numTextures = 0, numPrograms = 0;

        scenes.forEach( (scene) => {
            numObjects += scene.object.children.length;
        });

        numDrawCalls += this.renderer.info.render.calls;
        numGeometries += this.renderer.info.memory.geometries;
        numFaces += this.renderer.info.render.triangles;
        numTextures += this.renderer.info.memory.textures;
        numPrograms += this.renderer.info.programs!.length;

        return {
            "numDrawCalls" : numDrawCalls,
            "numObjects": numObjects,
            "numFaces": numFaces,
            "numTextures": numTextures,
            "numGeometries": numGeometries,
            "numParticles": -1,
            "numPrograms": numPrograms,
        }

    }

}
