import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";

import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import IGameData from "../Player/IGameData";
import { Lara } from "./Lara";
import { SystemLight } from "../Player/SystemLight";

const DURATION = 0.1;
const COLOR = [0.6, 0.5, 0.1];
const DISTANCE = 3072 * 2;

export class MuzzleFlash extends Behaviour {

    public name: string = MuzzleFlash.name;

    protected _bhvMgr:       BehaviourManager;
    protected _sysLight:     SystemLight;
    protected _startTime:    number;
    protected _boneNumber:   number;
    protected _lightNum:     number;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this._bhvMgr = gameData.bhvMgr;
        this._sysLight = gameData.sysLight;
        this._startTime = -1;
        this._boneNumber = 0;

        this._lightNum = this._sysLight.add();
        this._sysLight.setFadeout(this._lightNum, DISTANCE);
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        this._startTime = -1;
        this._boneNumber = this.nbhv.bone ? this.nbhv.bone : 0;

        return [BehaviourRetCode.keepBehaviour, null];
    }

    public onFrameStarted(curTime: number, delta: number): void {
        if (this._startTime < 0) {
            this._startTime = curTime;
        }

        const time = curTime - this._startTime;

        if (time < DURATION) {
            let intensity = (DURATION - time) * 20;

            const lara = (this._bhvMgr.getBehaviour("Lara") as Array<Lara>)[0],
                  position = lara.getSkeleton().getBoneDecomposition(this._boneNumber, lara.getObject()).pos;

            this._sysLight.setPosition(this._lightNum, position);
            this._sysLight.setColor(this._lightNum, [Math.min(COLOR[0] * intensity, 1), Math.min(COLOR[1] * intensity, 1), Math.min(COLOR[2] * intensity, 1)]);
        } else {
            this._sysLight.remove(this._lightNum);
            this._bhvMgr.removeBehaviour(this);
        }
    }

}

BehaviourManager.registerFactory(MuzzleFlash);
