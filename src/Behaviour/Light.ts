import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";

export class Light extends Behaviour {

    public name: string = Light.name;

    protected lstObjs: Array<IMesh>;
    protected _color: Array<number>;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.lstObjs = <any>null;
        this._color = [0, 0, 0];
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        const color = this.nbhv.color, range = parseInt(this.nbhv.range.max);

        if (lstObjs == null) {
            return [BehaviourRetCode.dontKeepBehaviour, null];
        }

        this._color = [parseFloat(color.r) / 255, parseFloat(color.g) / 255, parseFloat(color.b) / 255];

        this.lstObjs = lstObjs as Array<IMesh>;

        this.lstObjs.forEach((obj) => {
            const roomIndex = this.gameData.sceneData.objects[obj.name].roomIndex,
                  roomData = this.gameData.sceneData.objects['room' + roomIndex];

            let globalLights: Array<any> = roomData.globalLights;

            if (!globalLights) {
                globalLights = [];
                roomData.globalLights = globalLights;
            }

            globalLights.push({
                "x": obj.position[0],
                "y": obj.position[1],
                "z": obj.position[2],
                "color": this._color,
                "fadeOut": range,
            });
        });

        return [BehaviourRetCode.keepBehaviour, null];
    }

}

BehaviourManager.registerFactory(Light);
