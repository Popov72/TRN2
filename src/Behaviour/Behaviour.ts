import IGameData from "../Player/IGameData";
import { IMesh } from "../Proxy/IMesh";
import { ICamera } from "../Proxy/ICamera";

export enum BehaviourRetCode {
    keepBehaviour = 0,
    dontKeepBehaviour
}

export abstract class Behaviour {

    public name: string = "";

    protected nbhv: any;
    protected gameData: IGameData;
    protected objectid: number | undefined;
    protected objecttype: string | undefined;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        this.nbhv = nbhv;
        this.gameData = gameData;
        this.objectid = objectid;
        this.objecttype = objecttype;
    }

    public abstract init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null];

    onFrameStarted?(curTime: number, delta: number): void;
    onFrameEnded?(curTime: number, delta: number): void;

}
