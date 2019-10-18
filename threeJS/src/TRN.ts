import { Object3D, PerspectiveCamera } from "three";

import Engine from "../../src/Proxy/Engine";
import "../../src/Main";

import "./Behaviours";
import Camera from "./Camera";
import Mesh from "./Mesh";
import Node from "./Node";
import Renderer from "./Renderer";
import SceneParser from "./SceneParser";

declare var glMatrix: any;

glMatrix.glMatrix.setMatrixArrayType(Array);

Engine.registerFunctions( {
    "makeMesh":     (obj: any) => new Mesh(obj as Object3D),

    "makeCamera":   (obj: any) => new Camera(obj as PerspectiveCamera),

    "makeNode":     () => new Node(),

    "parseScene":   (sceneJSON: any) => {
        const sceneParser = new SceneParser();

        return new Promise<any>((resolve, reject) => {
            sceneParser.parse(sceneJSON, resolve);
        });
    },

    "createRenderer": (container: Element) => {
        return new Renderer(container);
    }
});
