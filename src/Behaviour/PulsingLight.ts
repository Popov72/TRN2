import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";

import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import IGameData from "../Player/IGameData";
import { SystemLight } from "../Player/SystemLight";

export class PulsingLight extends Behaviour {

    public name: string = PulsingLight.name;

    protected _bhvMgr:       BehaviourManager;
    protected _sysLight:     SystemLight;
    protected _startTime:    number;
    protected _lightNum:     number;
    protected _color:       Array<number>;
    protected _frequency:   number;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this._bhvMgr = gameData.bhvMgr;
        this._sysLight = gameData.sysLight;
        this._startTime = -1;
        this._lightNum = -1;
        this._color = [0, 0, 0];
        this._frequency = 0;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        if (lstObjs == null) {
            return [BehaviourRetCode.dontKeepBehaviour, null];
        }

        const objIndex = parseInt(this.nbhv.objindex ? this.nbhv.objindex : "0");

        this._lightNum = this._sysLight.add();
        this._sysLight.setFadeout(this._lightNum, parseFloat(this.nbhv.range.max));
        this._sysLight.setPosition(this._lightNum, lstObjs[objIndex].position);

        this._color = [parseFloat(this.nbhv.color.r) / 255, parseFloat(this.nbhv.color.g) / 255, parseFloat(this.nbhv.color.b) / 255];
        this._frequency = parseFloat(this.nbhv.frequency);

        return [BehaviourRetCode.keepBehaviour, null];
    }

    public onFrameStarted(curTime: number, delta: number): void {
        if (this._startTime < 0) {
            this._startTime = curTime;
        }

        const time = curTime - this._startTime;

        let intensity = Math.abs(Math.sin(Math.PI * time / this._frequency));

        this._sysLight.setColor(this._lightNum, [this._color[0] * intensity, this._color[1] * intensity, this._color[2] * intensity]);
    }

}

BehaviourManager.registerFactory(PulsingLight);
