import {
    Buffer,
    Camera as BCamera,
    Engine,
    Mesh as BMesh,
    MultiMaterial,
    Quaternion,
    Scene as BScene,
    SubMesh,
    Texture,
    UniversalCamera,
    Vector3, Vector4,
    VertexData,
    ShaderMaterial,
} from 'babylonjs';

import { TextureList } from "../../src/Proxy/IScene";

import Camera from "./Camera";
import Mesh from "./Mesh";
import Scene  from "./Scene";
import { ShaderManager } from "./ShaderManager";

export default class SceneParser {

    private json: any;
    private engine: Engine;
    private textures: TextureList;
    private textureMap: {
        [name: string] : Texture
    };
    private shdMgr: ShaderManager;
    private _numTextureLoadedNotifications: number;
    private _numMeshesToHandle = 0;

    private scene: BScene;
    private tscene: Scene;

    constructor(engine: Engine, shdMgr: ShaderManager) {
        this.engine = engine;
        this.shdMgr = shdMgr;

        this.scene = new BScene(engine);
        this.scene.useRightHandedSystem = true;
        this.scene.autoClear = false;

        this.textures = [];
        this.tscene = new Scene(this.scene, this.textures);
        this.textureMap = {};
        this._numTextureLoadedNotifications = 0;
        this._numMeshesToHandle = 0;
    }

    public parse(json: any, onLoad: any): void {
        this.json = json;

        this.createScene();

        //this.scene.debugLayer.show({ embedMode: false, handleResize: false, overlay: true, showExplorer: true, showInspector: true });

        this.scene.getBoundingBoxRenderer().showBackLines = false;

        // wait all textures are loaded before going on
        // we need to have the width/height properties of the texture uniforms to be set before going on, because
        // we need them later on (when cloning materials - those properties must have valid values and not be undefined)
        const idTimer = setInterval(() => {
            if (this._numTextureLoadedNotifications == 0 && this._numMeshesToHandle == 0) {
                clearInterval(idTimer);
                this.scene.detachControl();
                onLoad(this.tscene);
            }
        }, 0);
    }

    private createScene(): void {
        this.createTextures();

        const objects = this.json.object.children;
        for (let o = 0; o < objects.length; ++o) {
            const object = objects[o];

            switch (object.type) {
                case "PerspectiveCamera":
                    this.createCamera(object);
                    break;

                case "Mesh":
                    this.createMesh(object);
                break;
            }
        }
    }

    private createCamera(json: any): void {
        const camera = new UniversalCamera(json.name, new Vector3(...(json.position as Array<number>)), this.tscene.object);

        camera.rotationQuaternion = new Quaternion(...(json.quaternion as []));
        camera.fov = (json.fov * Math.PI) / 180.0;
        camera.minZ = json.near;
        camera.maxZ = json.far;
        camera.mode = BCamera.PERSPECTIVE_CAMERA;

        camera.inputs.clear();
        camera.inputs.removeMouse();

        this.scene.setActiveCameraByName(json.name);

        this.tscene.setCamera(new Camera(camera));
    }

    private createTextures(): void {
        for (let t = 0; t < this.json.textures.length; ++t) {
            const texture = this.json.textures[t],
                  image = this.getImage(texture.image),
                  tex = new Texture(
                    "data:" + texture.uuid,
                    this.scene,
                    true,
                    false,
                    Texture.BILINEAR_SAMPLINGMODE,
                    null, null,
                    image.url
                  );

            tex.wrapU = tex.wrapV = Texture.CLAMP_ADDRESSMODE;
            tex.hasAlpha = true;

            this.textures.push(tex);
            this.textureMap[texture.uuid] = tex;
        }
    }

    private createMesh(json: any): void {
        const mesh = new BMesh(json.name, null),
              geometry = this.getGeometry(json.geometry),
              attr = geometry.data.attributes,
              groups = geometry.data.groups,
              materials = json.material;

        mesh.position.set((json.position as Array<number>)[0], (json.position as Array<number>)[1], (json.position as Array<number>)[2]);
        mesh.rotationQuaternion = new Quaternion((json.quaternion as Array<number>)[0], (json.quaternion as Array<number>)[1], (json.quaternion as Array<number>)[2], (json.quaternion as Array<number>)[3]);
        mesh.useVertexColors = false;
        mesh.showBoundingBox = false;

        const vDat = new VertexData();

        vDat.positions = Array.from(attr.position.array);
        vDat.normals = Array.from(attr.normal.array);
        vDat.uvs = Array.from(attr.uv.array);

        vDat.indices = Array.from(geometry.data.index.array);

        for (let i = 0; i < vDat.indices.length; i += 3) {
            const i0 = vDat.indices[i];
            vDat.indices[i] = vDat.indices[i + 2];
            vDat.indices[i + 2] = i0;
        }

        vDat.applyToMesh(mesh);

        mesh.subMeshes = [];

        let attributes = ["position", "uv", "normal"];

        ['vertColor', '_flags', 'skinIndex', 'skinWeight'].forEach((attrName) => {
            if (attr[attrName]) {
                const buffer = new Buffer(this.engine, Array.from(attr[attrName].array), false, attr[attrName].itemSize);
                mesh.setVerticesBuffer(buffer.createVertexBuffer(attrName, 0, attr[attrName].itemSize));
                attributes.push(attrName);
            }
        });

        const multimat = new MultiMaterial(json.name, this.scene),
                totalVertices = mesh.getTotalVertices(),
                promises: Array<Promise<void>> = [];

        for (let m = 0; m < materials.length; ++m) {
            const material = this.getMaterial(materials[m]);

            const doShaderMat = ((mat: any) => {
                const material = mat;

                return (shdCode: Array<any>) => {
                    let uniformsUsed = new Set<string>();

                    this.shdMgr.getVertexUniforms(material.vertexShader)!.forEach((u) => uniformsUsed.add(u));
                    this.shdMgr.getFragmentUniforms(material.fragmentShader)!.forEach((u) => uniformsUsed.add(u));

                    let uniforms = Array.from<string>(uniformsUsed);
                    let samplers = ["map", "mapBump"];

                    for (const uname in material.uniforms) {
                        uniforms.push(uname);
                    }

                    const shd = new ShaderMaterial(material.uuid, this.scene, {
                        "vertex":   shdCode[0],
                        "fragment": shdCode[1],
                    }, {
                        attributes: attributes,
                        samplers: samplers,
                        uniforms: uniforms,
                        needAlphaBlending: material.transparent,
                    });

                    for (const uname in material.uniforms) {
                        const uval = material.uniforms[uname];
                        switch (uval.type) {
                            case 't':
                                shd.setTexture(uname, this.textureMap[uval.value]);
                                if (!this.textureMap[uval.value].isReady()) {
                                    this._numTextureLoadedNotifications++;
                                    this.textureMap[uval.value].onLoadObservable.add((texture: Texture) => {
                                        uval.width = texture.getSize().width;
                                        uval.height = texture.getSize().height;
                                        this._numTextureLoadedNotifications--;
                                    });
                                } else {
                                    uval.width = this.textureMap[uval.value].getSize().width;
                                    uval.height = this.textureMap[uval.value].getSize().height;
                                }
                                uval.value = this.textureMap[uval.value];
                                break;
                            case 'i':
                                shd.setInt(uname, uval.value);
                                break;
                            case 'f':
                                shd.setFloat(uname, uval.value);
                                break;
                            case 'f3':
                                shd.setVector3(uname, new Vector3((uval.value as Array<number>)[0], (uval.value as Array<number>)[1], (uval.value as Array<number>)[2]));
                                break;
                            case 'f4':
                                shd.setVector4(uname, new Vector4((uval.value as Array<number>)[0], (uval.value as Array<number>)[1], (uval.value as Array<number>)[2], (uval.value as Array<number>)[3]));
                                break;
                        }
                    }

                    shd.metadata = {
                        "uniforms": material.uniforms,
                        "userData": material.userData,
                    };

                    if (material.transparent) {
                        shd.alphaMode = Engine.ALPHA_SCREENMODE;
                        shd.disableDepthWrite = true;
                    }

                    multimat.subMaterials.push(shd);

                    SubMesh.AddToMesh(multimat.subMaterials.length - 1, 0, totalVertices, groups[m].start, groups[m].count, mesh);
                };
            })(material);

            promises.push(
                Promise.all([this.shdMgr.getVertexShader(material.vertexShader), this.shdMgr.getFragmentShader(material.fragmentShader)]).then((shdCode) => doShaderMat(shdCode))
            );
        }

        this._numMeshesToHandle++;

        Promise.all(promises).then(() => {
            mesh.material = multimat;

            this.tscene.add(new Mesh(mesh));

            this._numMeshesToHandle--;
        });
    }

    private getImage(id: string): any {
        for (let i = 0; i < this.json.images.length; ++i) {
            const image = this.json.images[i];

            if (image.uuid == id) { return image; }
        }
    }

    private getGeometry(id: string): any {
        for (let g = 0; g < this.json.geometries.length; ++g) {
            const geometry = this.json.geometries[g];

            if (geometry.uuid == id) { return geometry; }
        }
    }

    private getMaterial(id: string): any {
        for (let g = 0; g < this.json.materials.length; ++g) {
            const material = this.json.materials[g];

            if (material.uuid == id) { return material; }
        }
    }

}
