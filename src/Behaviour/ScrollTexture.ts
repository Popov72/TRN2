import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { moveableScrollAnimTileHeight } from "../Constants";

export class ScrollTexture extends Behaviour {

    public name: string = ScrollTexture.name;

    protected lstObjs: Array<IMesh>;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.lstObjs = <any>null;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        if (lstObjs == null) {
            return [BehaviourRetCode.dontKeepBehaviour, null];
        }

        this.lstObjs = lstObjs as Array<IMesh>;

        return [BehaviourRetCode.keepBehaviour, null];
    }

    public onFrameEnded(curTime: number, delta: number): void {
        for (let i = 0; i < this.lstObjs.length; ++i) {
            const obj = this.lstObjs[i],
                  materials = obj.materials;

            for (let m = 0; m < materials.length; ++m) {
                let material = materials[m],
                    pgr = (curTime * 1000.0) / (5 * material.uniforms.map.height),
                    h = (moveableScrollAnimTileHeight / 2.0) / material.uniforms.map.height;

                pgr = pgr - h * Math.floor(pgr / h);

                material.uniforms.offsetRepeat.value[1] = h - pgr;

                material.uniformsUpdated(["offsetRepeat"]);
            }
        }
    }

}

BehaviourManager.registerFactory(ScrollTexture);
