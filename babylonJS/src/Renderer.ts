import { Engine, Scene as BScene, SceneInstrumentation, EngineInstrumentation, PerfCounter } from "babylonjs";

import { IRenderer, PerfData } from "../../src/Proxy/IRenderer";

import Camera from "./Camera";
import Scene from "./Scene";

export default class Renderer implements IRenderer {

    protected _engine: Engine;
    protected _sctc: PerfCounter;

    constructor(container: Element, engine: Engine, canvas: HTMLCanvasElement) {
        container.appendChild(canvas);
        this._engine = engine;

        const ei = new EngineInstrumentation(this._engine);
        ei.captureShaderCompilationTime = true;

        this._sctc = ei.shaderCompilationTimeCounter;
    }

    get engine(): Engine {
        return this._engine;
    }
    
    public setSize(width: number, height: number): void {
        const scale = this._engine.getHardwareScalingLevel();
        this._engine.setSize(width / scale, height / scale);
    }

    public createScene(): Scene {
        let newScene = new BScene(this._engine);
        newScene.useRightHandedSystem = true;
        return new Scene(newScene);
    }

    public clear(): void {
    }

    public render(scene: Scene, camera: Camera): void {
        scene.object.activeCamera = camera.object;
        scene.object.render();
    }
 
    public getPerfData(scenes: Array<Scene>): PerfData {
        let numDrawCalls = 0, numObjects = 0, numGeometries = 0, numFaces = 0, numTextures = 0, numParticles = 0, numPrograms = 0;

        scenes.forEach( (scene) => {
            numObjects += scene.object.getActiveMeshes().length;
            numGeometries += scene.object.getGeometries().length;
            numFaces += scene.object.getActiveIndices()/3;
            numTextures += scene.object.textures.length;
            numParticles += scene.object.getActiveParticles();
        });

        numDrawCalls = new SceneInstrumentation(scenes[0].object).drawCallsCounter.current;
        numPrograms = this._sctc.count;

        return {
            "numDrawCalls" : numDrawCalls,
            "numObjects": numObjects,
            "numFaces": numFaces,
            "numTextures": numTextures,
            "numGeometries": numGeometries,
            "numParticles": numParticles,
            "numPrograms": numPrograms,
        }
    }
    
}
