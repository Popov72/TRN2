import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { ObjectManager } from "../Player/ObjectManager";

export class Sprite extends Behaviour {

    public name: string = Sprite.name;

    private objMgr: ObjectManager;
    private camera: ICamera;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.objMgr = gameData.objMgr;
        this.camera = gameData.camera;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        return [BehaviourRetCode.keepBehaviour, null];
    }

    public frameEnded(curTime: number, delta: number): void {
        // make sure the object is always facing the camera
        const cameraRot = this.camera.quaternion;

        const objects = Object.assign({}, this.objMgr.objectList['sprite'], this.objMgr.objectList['spriteseq']);

        for (let objID in objects) {
            const lstObj = objects[objID] as Array<IMesh>;

            for (let i = 0; i < lstObj.length; ++i) {
                const obj = lstObj[i];

                obj.setQuaternion(cameraRot);
            }
        }
    }

}

BehaviourManager.registerFactory(Sprite.name,
    (nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) => new Sprite(nbhv, gameData, objectid, objecttype)
);
