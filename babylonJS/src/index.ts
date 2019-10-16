declare var glMatrix: any;

import { 
    Engine as BEngine,
    Mesh as BMesh,
    TargetCamera 
} from "babylonjs";

import Engine from "../../src/Proxy/Engine";
import Camera from "./Camera";
import Mesh from "./Mesh";
import Scene from "./Scene";
import Renderer from "./Renderer";
import SceneParser from "./SceneParser";

import "../../src/Main";

import "./Behaviours";

glMatrix.glMatrix.setMatrixArrayType(Array);

const canvas = document.createElement("canvas"),
      engine = new BEngine(canvas, true);

Engine.registerFunctions( {
    "makeMesh": (obj: any) => new Mesh(obj as BMesh),

    "makeCamera": (obj: any) => new Camera(obj as TargetCamera),

    "parseScene": (sceneJSON: any, callback: (scene: Scene) => void ) => {
        console.log(sceneJSON);

        const sceneParser = new SceneParser(engine);

        sceneParser.parse(sceneJSON, callback);
    },

    "createRenderer": (container: Element) => {
        return new Renderer(container, engine, canvas);
    }
});

/*
let parser = new TR4CutSceneDecoder("/resources/level/tr4/cutseq.pak");

(async () => {
    await parser.parse();
    console.log(parser.layout);
    for (let i = 0; i < parser.layout.cutscenes.length; ++i)
        console.log('#' + (i+1) + '\n', JSON.stringify(parser.layout.cutscenes[i]));
})();
*/

/*
glMatrix.glMatrix.setMatrixArrayType(Array);

var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement, controls: BasicControls, camera: TargetCamera, sky: Nullable<TransformNode>, skydome: Nullable<TransformNode>;
var showInspector = false;
var sprites: Array<TransformNode> = [];

function onWindowResize() {
    var width = window.innerWidth, height = window.innerHeight, scale = engine.getHardwareScalingLevel();
    engine.setSize(width / scale, height / scale);
}

let engine = new Engine(canvas as any, true);

let scene = new Scene(engine);

async function init() {
    scene = await SceneLoader.AppendAsync("resource/", "test.gltf?v=" + (new Date()).getTime(), scene);

    scene.clearColor = new Color4(0,0,0,1);
        
    scene.meshes.forEach( function ( child ) {

        if ( !child.name.startsWith("room") && (child as any).userData && (child as any).userData.TRN_node ) {
            let lchild = child;
            if (child.name.indexOf('primitive') >= 0) (lchild as any)= child.parent;
            let nd = (child as any).userData.TRN_node as any;
            lchild.position.set((nd.translation as Array<number>)[0], (nd.translation as Array<number>)[1], (nd.translation as Array<number>)[2]);
            lchild.rotationQuaternion = new Quaternion((nd.quaternion as Array<number>)[0], (nd.quaternion as Array<number>)[1], (nd.quaternion as Array<number>)[2],  (nd.quaternion as Array<number>)[3]);
            console.log(lchild.name,nd.translation, lchild);
            (child as Mesh).refreshBoundingInfo(true);
        }

        //child.showBoundingBox = true;

        let mat = <PBRBaseMaterial>child.material;
        if (mat && mat.transparencyMode == 2) {
            mat.transparencyMode = 3;
            mat.disableDepthWrite = true;
            mat.alphaMode = Engine.ALPHA_ADD;
        }

        if ((child as any).userData && (child as any).userData.TRN_behaviours) {
            (child as any).userData.TRN_behaviours.forEach(function(bhv: any) {
                if (bhv.type == 'sprite') sprites.push(child);
            });
        }

        child.renderingGroupId = 3;
    });

    camera = scene.activeCamera = <TargetCamera>scene.cameras[0];
    camera.rotationQuaternion = Quaternion.RotationYawPitchRoll(camera.rotation.y, camera.rotation.x, camera.rotation.z);

    controls = new BasicControls( document.body, camera, scene );

    let lara: TransformNode = scene.getNodeByName("moveable0_0") as TransformNode;

    console.log(lara);

    skydome = scene.getNodeByName("skydome") as Nullable<TransformNode>;
    sky = scene.getNodeByName("sky_primitive0") as Nullable<TransformNode>;
    if (sky) sky = sky.parent as Nullable<TransformNode>;

    //sprites.forEach( m => console.log(m.name))

    if (skydome) {
        skydome.parent = camera.parent;
        [skydome, skydome.getChildren()].flat().forEach(c => c.renderingGroupId = 1);
        //console.log(skydome, skydome.getChildren());
    }
    if (sky) {
        sky.parent = camera.parent;
        [sky, sky.getChildren()].flat().forEach(c => c.renderingGroupId = 2);
        //console.log(sky, sky.getChildren());
    }

    //scene.removeMesh(skydome as Mesh);
    onWindowResize();

    if (showInspector) scene.debugLayer.show();

    var fpsLabel:Nullable<HTMLElement> = document.getElementById("fpsLabel");

    window.addEventListener("resize", onWindowResize);

    engine.runRenderLoop(function () {
        var delta = engine.getDeltaTime()/1000.0;
        if (scene && camera) {
            if (controls) controls.update( delta );

            if (sky) sky.position = camera.position;
            if (skydome) skydome.position = camera.position;

            sprites.forEach( (mesh: TransformNode) => mesh.rotationQuaternion!.copyFrom(camera.rotationQuaternion) );

            scene.render();

            fpsLabel!.innerHTML = engine.getFps().toFixed() + " fps";
        }
    });

}

init();
*/