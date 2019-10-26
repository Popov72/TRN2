import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";
import { Position } from "../Proxy/INode";
import { Fade } from "./Fade";

export class FadeUniformColor extends Fade {

    public name: string = FadeUniformColor.name;

    protected uniforms: Array<any>;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.uniforms = <any>null;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        if (this.nbhv.uniforms === null) {
            return [BehaviourRetCode.dontKeepBehaviour, null];
        }

        this.uniforms = this.nbhv.uniforms;

        return super.init(lstObjs);
    }

    protected setColor(color: Position): void {
        for (let i = 0; i < this.uniforms.length; ++i) {
            const u = this.uniforms[i];

            u.a[u.i + 0] = color[0];
            u.a[u.i + 1] = color[1];
            u.a[u.i + 2] = color[2];
        }
    }

}

BehaviourManager.registerFactory(FadeUniformColor.name,
    (nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) => new FadeUniformColor(nbhv, gameData, objectid, objecttype)
);
