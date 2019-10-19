import { ICamera } from "../Proxy/ICamera";
import { IMesh, isMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";

export class Zbias extends Behaviour {

    public name: string = Zbias.name;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        const params = this.nbhv.polygoneoffset;

        if (lstObjs && params) {
            const factor = params.factor, unit = params.unit;
            lstObjs.forEach( (obj) => {
                if (isMesh(obj)) {
                    const materials = obj.materials;
                    for (let m = 0; m < materials.length; ++m) {
                        const material = materials[m];
                        material.setZBias(factor, unit);
                    }
                }
            });
        }

        return [BehaviourRetCode.dontKeepBehaviour, null];
    }

}

BehaviourManager.registerFactory(Zbias.name, 
    (nbhv: any, gameData: any, objectid?: number, objecttype?: string) => new Zbias(nbhv, gameData, objectid, objecttype)
);
