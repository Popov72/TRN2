import { ShaderManager } from "../ShaderManager";
import { IMesh } from "./IMesh";
import { IMeshBuilder } from "./IMeshBuilder";
import { INode } from "./INode";
import { IRenderer } from "./IRenderer";
import { IScene } from "./IScene";

export interface funcPointers {
    "makeNode":         () => INode,
    "makeMeshBuilder":  (mesh?: IMesh) => IMeshBuilder,
    "parseScene":       (sceneJSON: any) => Promise<IScene>,
    "createRenderer":   (container: Element) => IRenderer,
    "getShaderMgr":     ShaderManager,
};

export default class Engine {
 
    private static pointers: funcPointers;

    public static registerFunctions(pointers: funcPointers): void {
        Engine.pointers = pointers;
    }

    public static makeNode(): INode {
        return Engine.pointers.makeNode();
    }

    public static makeMeshBuilder(mesh?: IMesh): IMeshBuilder {
        return Engine.pointers.makeMeshBuilder(mesh);
    }

    public static parseScene(sceneJSON: any): Promise<any> {
        return Engine.pointers.parseScene(sceneJSON);
    }

    public static createRenderer(container: Element): IRenderer {
        return Engine.pointers.createRenderer(container);
    }

    public static getShaderMgr(): ShaderManager {
        return Engine.pointers.getShaderMgr;
    }
}
