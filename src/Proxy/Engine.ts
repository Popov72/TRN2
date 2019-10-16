import { IMesh } from "./IMesh";
import { ICamera } from "./ICamera";
import { IScene } from "./IScene";
import { IRenderer } from "./IRenderer";

export interface funcPointers {
    "makeMesh":         (obj: any) => IMesh,
    "makeCamera":       (obj: any) => ICamera,
    "parseScene":       (sceneJSON: any, callback: (scene: IScene) => void ) => void,
    "createRenderer":   (container: Element) => IRenderer,
};

export default class Engine {
 
    private static pointers: funcPointers;

    public static registerFunctions(pointers: funcPointers): void {
        Engine.pointers = pointers;
    }

    public static makeMesh(obj: any): IMesh {
        return Engine.pointers.makeMesh(obj);
    }

    public static makeCamera(obj: any): ICamera {
        return Engine.pointers.makeCamera(obj);
    }

    public static parseScene(sceneJSON: any, callback: (scene: IScene) => void ): void {
        Engine.pointers.parseScene(sceneJSON, callback);
    }

    public static createRenderer(container: Element): IRenderer {
        return Engine.pointers.createRenderer(container);
    }
}
