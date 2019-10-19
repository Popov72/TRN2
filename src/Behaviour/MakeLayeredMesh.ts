import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { Layer } from "../Player/Layer";

export class MakeLayeredMesh extends Behaviour {

    public name: string = MakeLayeredMesh.name;

    protected sceneData: any;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.sceneData = gameData.sceneData;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        if (lstObjs != null) {
            lstObjs.forEach( (obj) => {
                const mesh = obj as IMesh,
                      data = this.sceneData.objects[mesh.name],
                      layer = new Layer(mesh, this.gameData);

                data.layer = layer;
            });
        }

        return [BehaviourRetCode.dontKeepBehaviour, null];
    }

}

BehaviourManager.registerFactory(MakeLayeredMesh.name, 
    (nbhv: any, gameData: any, objectid?: number, objecttype?: string) => new MakeLayeredMesh(nbhv, gameData, objectid, objecttype)
);
