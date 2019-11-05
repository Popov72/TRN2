import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";

import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import IGameData from "../Player/IGameData";
import { SystemLight } from "../Player/SystemLight";

export class DynamicLight extends Behaviour {

    public name: string = DynamicLight.name;

    protected _sysLight:     SystemLight;
    protected _lightNum:     number;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this._sysLight = gameData.sysLight;

        this._lightNum = this._sysLight.add();
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        return [BehaviourRetCode.keepBehaviour, null];
    }

    set fadeout(f: number) {
        this._sysLight.setFadeout(this._lightNum, f);
    }

    set position(p: Array<number>) {
        this._sysLight.setPosition(this._lightNum, p);
    }

    set color(c: Array<number>) {
        this._sysLight.setColor(this._lightNum, c);
    }
}

BehaviourManager.registerFactory(DynamicLight);
