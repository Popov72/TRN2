declare var glMatrix: any;

import { Object3D, PerspectiveCamera } from "three";

import Engine from "../../src/Proxy/Engine";
import Mesh from "./Mesh";
import Camera from "./Camera";
import Scene from "./Scene";
import Renderer from "./Renderer";
import SceneParser from "./SceneParser";

import "../../src/Main";

import "./Behaviours";

glMatrix.glMatrix.setMatrixArrayType(Array);

Engine.registerFunctions( {
    "makeMesh": (obj: any) => new Mesh(obj as Object3D),

    "makeCamera": (obj: any) => new Camera(obj as PerspectiveCamera),

    "parseScene": (sceneJSON: any, callback: (scene: Scene) => void ) => {
        const sceneParser = new SceneParser();

        sceneParser.parse(sceneJSON, callback);
    },

    "createRenderer": (container: Element) => {
        return new Renderer(container);
    }
});
