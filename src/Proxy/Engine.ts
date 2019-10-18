import { ICamera } from "./ICamera";
import { IMesh } from "./IMesh";
import { INode } from "./INode";
import { IRenderer } from "./IRenderer";
import { IScene } from "./IScene";

export interface funcPointers {
    "makeMesh":         (obj: any) => IMesh,
    "makeCamera":       (obj: any) => ICamera,
    "makeNode":         () => INode,
    "parseScene":       (sceneJSON: any) => Promise<IScene>,
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

    public static makeNode(): INode {
        return Engine.pointers.makeNode();
    }

    public static parseScene(sceneJSON: any): Promise<any> {
        return Engine.pointers.parseScene(sceneJSON);
    }

    public static createRenderer(container: Element): IRenderer {
        return Engine.pointers.createRenderer(container);
    }
}
