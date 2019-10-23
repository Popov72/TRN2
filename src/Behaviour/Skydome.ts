import Engine from "../Proxy/Engine";
import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { ObjectManager } from "../Player/ObjectManager";
import SkyDome from "../Utils/SkyDome";

export class Skydome extends Behaviour {

    public name: string = Skydome.name;

    protected objSky: IMesh;
    protected camera: ICamera;
    protected objMgr: ObjectManager;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.objMgr = gameData.objMgr;
        this.camera = gameData.camera;
        this.objSky = <any>null;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        const promise = this.createSkyDome().then(() => {
            this.objSky.renderOrder = 0;
            this.objSky.matrixAutoUpdate = true;

            this.gameData.sceneBackground.add(this.objSky);

            const skyColor = [this.nbhv.color.r / 255.0, this.nbhv.color.g / 255.0, this.nbhv.color.b / 255.0],
                  material = this.objSky.materials[0];

            material.depthWrite = false;
            material.uniforms.tintColor.value = skyColor;

            material.uniformsUpdated();
        });

        return [BehaviourRetCode.keepBehaviour, [promise]];
    }

    public frameEnded(curTime: number, delta: number): void {
        this.objSky.setPosition(this.camera.position);

        const material = this.objSky.materials[0];

        let pgr = curTime / 50.0;

        material.uniforms.offsetRepeat.value[0] = pgr - Math.floor(pgr);

        material.uniformsUpdated(["offsetRepeat"]);
    }

    protected createSkyDome(): Promise<any> {
        const meshData = SkyDome.create(
            /*curvature*/ 10.0,
            /*tiling*/ 3,
            /*distance*/ 2000.0,
            /*orientation*/ [0, 0, 0, 1],
            /*xsegments*/ 16,
            /*ysegments*/ 16,
            /*ySegmentsToKeep*/ 8
        );

        const skyTexture = this.gameData.sceneData.textures[this.gameData.sceneData.textures.length - 1];

        (skyTexture as any).wrapS = (skyTexture as any).wrapT = 1000; // for threejs
        (skyTexture as any).wrapU = (skyTexture as any).wrapV = 1; // for babylon - don't want to abstract that...

        const uniforms = {
            "map" :             { type: "t",    value: skyTexture },
            "offsetRepeat" :    { type: "f4",   value: [0, 0, 1, 1] },
            "tintColor" :       { type: "f3",   value: [0, 0, 0] }
        };

        return Promise.all([this.gameData.shdMgr.getVertexShader('TR_skydome'), this.gameData.shdMgr.getFragmentShader('TR_skydome')]).then((shd) => {
            const meshb = Engine.makeMeshBuilder();

            this.objSky = meshb.createMesh('skydome', shd[0], shd[1], uniforms, meshData.vertices, meshData.faces, meshData.textures, undefined);

            this.gameData.sceneData.objects['skydome'] = {
                "type"					: 'skydome',
                "objectid"              : '0',
                "roomIndex"             : -1,
                "visible"  				: true
            };

            this.objMgr.objectList['skydome'] = {0: [this.objSky] };
        });
    }

}

BehaviourManager.registerFactory(Skydome.name,
    (nbhv: any, gameData: any, objectid?: number, objecttype?: string) => new Skydome(nbhv, gameData, objectid, objecttype)
);
