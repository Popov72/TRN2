import { ICamera } from "./ICamera";
import { IScene } from "./IScene";

export interface PerfData {
    "numDrawCalls" : number;
    "numObjects": number;
    "numFaces": number;
    "numTextures": number;
    "numGeometries": number;
    "numParticles": number;
    "numPrograms": number;
}

export interface IRenderer {

    setSize(width: number, height: number): void;

    createScene(): IScene;

    clear(): void;

    render(scene: IScene, camera: ICamera): void;

    getPerfData(scenes: Array<IScene>): PerfData;
}
