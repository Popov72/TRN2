import { IMesh } from "./IMesh";
import { ICamera } from "./ICamera";

export type TextureList = Array<any>;

export interface IScene {

    textures: TextureList | undefined;
    allMeshesReady: boolean;

    traverse(callback: (obj: IMesh) => void): void;

    add(obj: IMesh | ICamera): void;

    remove(obj: IMesh | ICamera): void;

    setCamera(camera: ICamera): void;

    getCamera(): ICamera;

    getObjectByName(name: string): IMesh | undefined;

}
