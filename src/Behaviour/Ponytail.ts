import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";

import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { Braid } from "../Player/Braid";
import IGameData from "../Player/IGameData";
import { Lara } from "./Lara";
import { ObjectID } from "../Constants";

export class Ponytail extends Behaviour {

    public name: string = Ponytail.name;

    protected _braids: Array<Braid>;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this._braids = [];
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        const id = this.nbhv.id, offsets_ = this.nbhv.offsets.offset, offsets: Array<any> = Array.isArray(offsets_) ? offsets_ : [offsets_], fixToHead = this.nbhv.fixtohead === 'true';

        ObjectID.LaraBraid = parseInt(id);

        const lara = (this.gameData.bhvMgr.getBehaviour("Lara") as Array<Lara>)[0].getObject();

        for (let i = 0; i < offsets.length; ++i) {
            const offset = { "x": "0", "y": "0", "z": "0", ...offsets[i] };

            this._braids.push(new Braid(lara, [parseFloat(offset.x), parseFloat(offset.y), parseFloat(offset.z)], this.gameData, fixToHead));
        }

        return [BehaviourRetCode.keepBehaviour, null];
    }

    public preWarm(): void {
        for (let n = 0; n < 30 * 3; ++n) {
            this._braids.forEach((b) => b.update(1 / 30, true));
        }
    }

    public onFrameEnded(curTime: number, delta: number): void {
        this._braids.forEach((b) => b.update(delta));
    }

    public reset(): void {
        this._braids.forEach((b) => b.reset());
    }

    public get braids(): Array<Braid> {
        return this._braids;
    }

}

BehaviourManager.registerFactory(Ponytail);
