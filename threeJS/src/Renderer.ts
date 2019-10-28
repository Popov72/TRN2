import {
    Scene as TScene,
    WebGLRenderer
} from "three";

import { IRenderer, PerfData } from "../../src/Proxy/IRenderer";

import Camera from "./Camera";
import Scene from "./Scene";

export default class Renderer implements IRenderer {

    protected _renderer: WebGLRenderer;

    constructor(container: Element) {
        const canvas = document.createElement('canvas'),
              context = canvas.getContext('webgl2', { alpha: false });

        this._renderer = new WebGLRenderer({ canvas: canvas, context: context as any, antialias: true });
        this._renderer.autoClear = false;

        container.appendChild(this._renderer.domElement);

        return this;
    }

    public setSize(width: number, height: number): void {
        this._renderer.setSize(width, height);
    }

    public createScene(): Scene {
        return new Scene(new TScene());
    }

    public clear(): void {
        this._renderer.clear(true, true, true);
    }

    public render(scene: Scene, camera: Camera): void {
        this._renderer.render(scene.object as TScene, camera.object);
    }

    public getPerfData(scenes: Array<Scene>): PerfData {
        let numDrawCalls = 0, numObjects = 0, numGeometries = 0, numFaces = 0, numTextures = 0, numPrograms = 0;

        scenes.forEach((scene) => {
            numObjects += scene.object.children.length;
        });

        numDrawCalls += this._renderer.info.render.calls;
        numGeometries += this._renderer.info.memory.geometries;
        numFaces += this._renderer.info.render.triangles;
        numTextures += this._renderer.info.memory.textures;
        numPrograms += this._renderer.info.programs!.length;

        return {
            "numDrawCalls" : numDrawCalls,
            "numObjects": numObjects,
            "numFaces": numFaces,
            "numTextures": numTextures,
            "numGeometries": numGeometries,
            "numParticles": -1,
            "numPrograms": numPrograms,
        };
    }

}
