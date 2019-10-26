import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { ObjectManager } from "../Player/ObjectManager";

export class RemoveObject extends Behaviour {

    public name: string = RemoveObject.name;

    private objMgr: ObjectManager;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.objMgr = gameData.objMgr;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        if (lstObjs) {
            lstObjs.forEach((obj) => {
                this.objMgr.removeObjectFromScene(obj as IMesh);
            });
        }

        return [BehaviourRetCode.dontKeepBehaviour, null];
    }

}

BehaviourManager.registerFactory(RemoveObject.name,
    (nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) => new RemoveObject(nbhv, gameData, objectid, objecttype)
);
