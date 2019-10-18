import { ICamera } from "../Proxy/ICamera";
import { IMesh, isMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { AnimationManager } from "../Animation/AnimationManager";

export class SetAnimation extends Behaviour {

    public name: string = SetAnimation.name;

    protected anmMgr: AnimationManager;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.anmMgr = gameData.anmMgr;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        const anim = parseInt(this.nbhv.anim);

        if (lstObjs !== null && lstObjs.length) {
            lstObjs.forEach( (obj) => isMesh(obj) ? this.anmMgr.setAnimation(obj, anim, false) : null );
        }

        return [BehaviourRetCode.dontKeepBehaviour, null];
    }

}

BehaviourManager.registerFactory(SetAnimation.name, 
    (nbhv: any, gameData: any, objectid?: number, objecttype?: string) => new SetAnimation(nbhv, gameData, objectid, objecttype)
);
