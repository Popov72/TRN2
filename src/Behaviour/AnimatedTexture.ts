import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import { IMaterial } from "../Proxy/IMaterial";
import { TextureList } from "../Proxy/IScene";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import Sequence from "../Player/Sequence";

export class AnimatedTexture extends Behaviour {

    public name: string = AnimatedTexture.name;

    protected animatedTextures: any;
    protected textures: TextureList;
    protected matList: Array<IMaterial>;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);
        
        this.animatedTextures = gameData.sceneData.animatedTextures;
        this.textures = gameData.sceneData.textures;
        this.matList = <any>null;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        if (lstObjs == null || lstObjs.length == 0 || !this.animatedTextures) {
            return [BehaviourRetCode.dontKeepBehaviour, null];
        }

		// initialize the animated textures
        for (let i = 0; i < this.animatedTextures.length; ++i) {
            const animTexture = this.animatedTextures[i];
            animTexture.progressor = new Sequence(animTexture.animcoords.length, 1.0/animTexture.animspeed);
        }

        // collect the materials we will have to update each frame
        const lstMaterials = [];

        for (let i = 0; i < lstObjs.length; ++i) {
            const obj = lstObjs[i] as IMesh;

            const materials = obj.materials;
            
            for (let m = 0; m < materials.length; ++m) {
                const material = materials[m],
                      userData = material.userData;

                if (!userData || !userData.animatedTexture) {
                    continue;
                }

                const animTexture = this.animatedTextures[userData.animatedTexture.idxAnimatedTexture];

                if (!animTexture.scrolltexture) {
                    lstMaterials.push(material);
                }
            }
        }

        this.matList = lstMaterials;

        return [BehaviourRetCode.keepBehaviour, null];
    }

    public frameStarted(curTime: number, delta: number) {
		for (let i = 0; i < this.animatedTextures.length; ++i) {
			const animTexture = this.animatedTextures[i];
			animTexture.progressor.update(delta);
		}
    }

    public frameEnded(curTime: number, delta: number) {
        for (let i = 0; i < this.matList.length; ++i) {
            const material = this.matList[i],
                  userData = material.userData,
                  animTexture = this.animatedTextures[userData.animatedTexture.idxAnimatedTexture],
                  coords = animTexture.animcoords[(animTexture.progressor.currentTile + userData.animatedTexture.pos) % animTexture.animcoords.length];

            material.uniforms.map.value = this.textures[coords.texture];
            material.uniforms.offsetRepeat.value[0] = coords.minU - userData.animatedTexture.minU;
            material.uniforms.offsetRepeat.value[1] = coords.minV - userData.animatedTexture.minV;

            material.uniformsUpdated(["map", "offsetRepeat"]);
        }
    }

}

BehaviourManager.registerFactory(AnimatedTexture.name, 
    (nbhv: any, gameData: any, objectid?: number, objecttype?: string) => new AnimatedTexture(nbhv, gameData, objectid, objecttype)
);
