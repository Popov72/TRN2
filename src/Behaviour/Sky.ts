import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";

export class Sky extends Behaviour {

    public name: string = Sky.name;

    protected objSky: IMesh;
    protected camera: ICamera;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.camera = gameData.camera;
        this.objSky = <any>null;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        const id = this.nbhv.id,
              hide = this.nbhv.hide == 'true',
              noanim = this.nbhv.noanim == 'true';

        if (hide) {
            return [BehaviourRetCode.dontKeepBehaviour, null];
        }

        this.objSky = this.gameData.objMgr.createMoveable(id, -1, undefined, false, false) as IMesh;

        if (this.objSky == null) {
            return [BehaviourRetCode.dontKeepBehaviour, null];
        }

        const data = this.gameData.sceneData.objects[this.objSky.name];

        data.has_anims = !noanim;

        this.objSky.renderOrder = 1;
        this.objSky.matrixAutoUpdate = true;

        if (data.has_anims) {
            this.gameData.anmMgr.setAnimation(this.objSky, 0, false);
        }

        this.gameData.sceneRender.remove(this.objSky);
        this.gameData.sceneBackground.add(this.objSky);

        const promiseShaders = Promise.all([this.gameData.shdMgr.getVertexShader('TR_sky'), this.gameData.shdMgr.getFragmentShader('TR_sky')]).then((shd) => {
            const materials = this.objSky.materials;
            for (let mat = 0; mat < materials.length; ++mat) {
                const material = materials[mat];

                material.depthWrite = false;

                material.vertexShader = shd[0];
                material.fragmentShader = shd[1];
            }
        });

        return [BehaviourRetCode.keepBehaviour, [promiseShaders]];
    }

    public onFrameEnded(): void {
        this.objSky.setPosition(this.camera.position);
    }

}

BehaviourManager.registerFactory(Sky);
