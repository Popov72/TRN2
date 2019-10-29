import { ICamera } from "../Proxy/ICamera";
import { IMaterial } from "../Proxy/IMaterial";
import { IMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { ObjectManager } from "../Player/ObjectManager";
import { uvRotateTileHeight } from "../Constants";

export class UVRotate extends Behaviour {

    public name: string = UVRotate.name;

    private animatedTextures: any;
    private matList: Array<IMaterial>;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.animatedTextures = gameData.sceneData.animatedTextures;
        this.matList = [];
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        if (lstObjs == null) {
            return [BehaviourRetCode.dontKeepBehaviour, null];
        }

        for (let i = 0; i < lstObjs.length; ++i) {
            const obj = lstObjs[i] as IMesh,
                  materials = obj.materials;

            for (let m = 0; m < materials.length; ++m) {
                const material = materials[m],
                      userData = material.userData;

                if (!userData || !userData.animatedTexture) {
                    continue;
                }

                const animTexture = this.animatedTextures[userData.animatedTexture.idxAnimatedTexture];

                if (animTexture.scrolltexture) {
                    this.matList.push(material);
                }
            }
        }

        return [BehaviourRetCode.keepBehaviour, null];
    }

    public onFrameEnded(curTime: number, delta: number) {
        for (let i = 0; i < this.matList.length; ++i) {
            let material = this.matList[i],
                userData = material.userData,
                animTexture = this.animatedTextures[userData.animatedTexture.idxAnimatedTexture],
                coords = animTexture.animcoords[0],
                pgr = (curTime * 1000.0) / (5 * material.uniforms.map.height),
                h = (uvRotateTileHeight / 2.0) / material.uniforms.map.height;

            pgr = pgr - h * Math.floor(pgr / h);

            material.uniforms.offsetRepeat.value[0] = coords.minU - userData.animatedTexture.minU;
            material.uniforms.offsetRepeat.value[1] = coords.minV - userData.animatedTexture.minV * 0.5 + h - pgr;
            material.uniforms.offsetRepeat.value[3] = 0.5;

            material.uniformsUpdated(["offsetRepeat"]);
        }
    }

}

BehaviourManager.registerFactory(UVRotate);
