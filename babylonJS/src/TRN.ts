import { 
    Engine as BEngine
} from "babylonjs";

import Engine from "../../src/Proxy/Engine";
import { IMesh } from "../../src/Proxy/IMesh";
import { ShaderManager } from "./ShaderManager";
import "../../src/Main";

import "./Behaviours";
import Mesh from "./Mesh";
import MeshBuilder from "./MeshBuilder";
import Node from "./Node";
import Renderer from "./Renderer";
import SceneParser from "./SceneParser";

declare var glMatrix: any;

glMatrix.glMatrix.setMatrixArrayType(Array);

const canvas = document.createElement("canvas"),
      engine = new BEngine(canvas, true);

Engine.registerFunctions( {
    "makeNode":         () => new Node(),

    "makeMeshBuilder":  (mesh: IMesh) => new MeshBuilder(mesh as Mesh),

    "parseScene":       (sceneJSON: any) => {
        const sceneParser = new SceneParser(engine);

        return new Promise<any>((resolve, reject) => {
            sceneParser.parse(sceneJSON, resolve);
        });
    },

    "createRenderer":   (container: Element) => {
        return new Renderer(container, engine, canvas);
    },

    "getShaderMgr":     new ShaderManager(),
});
