import {
    ParticleSystem as BParticleSystem,
    Quaternion,
    Vector3
} from "babylonjs";

import { ICamera } from "../../../src/Proxy/ICamera";
import { IMesh, isMesh } from "../../../src/Proxy/IMesh";
import { Position } from "../../../src/Proxy/INode";
import { Behaviour, BehaviourRetCode } from "../../../src/Behaviour/Behaviour";
import { BehaviourManager } from "../../../src/Behaviour/BehaviourManager";
import IGameData from "../../../src/Player/IGameData";

import Scene from "../Scene";

export class ParticleSystem extends Behaviour {

    public name: string = ParticleSystem.name;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        let itemID = this.nbhv.itemid, pname = this.nbhv.name, ofst = { "x": "0", "y": "0", "z": "0", ...this.nbhv.offset };

        if (lstObjs == null && itemID === undefined) {
            return [BehaviourRetCode.dontKeepBehaviour, null];
        }

        const positions: Array<{ "pos": Position, "obj": IMesh | null }> = [];

        (lstObjs || []).forEach((obj) => {
            if (isMesh(obj)) {
                let q = new Quaternion(...obj.quaternion),
                    v = new Vector3(parseInt(ofst.x), parseInt(ofst.y), parseInt(ofst.z));

                let vrot = new Vector3();

                v.rotateByQuaternionToRef(q, vrot);

                positions.push({ "pos": [obj.position[0] + vrot.x, obj.position[1] + vrot.y, obj.position[2] + vrot.z], "obj": obj });

                this.gameData.objMgr.removeObjectFromScene(obj, true);
            }
        });

        if (itemID !== undefined) {
            itemID = parseInt(itemID);
            for (let i = 0; i < this.gameData.trlvl.trlevel.items.length; ++i) {
                const item = this.gameData.trlvl.trlevel.items[i];

                if (item.objectID == itemID) {
                    positions.push({ "pos": [item.x + parseInt(ofst.x), -item.y + parseInt(ofst.y), -item.z + parseInt(ofst.z)], "obj": null });
                }
            }
        }

        const promise = fetch(`/resources/particle/${pname}.json`).then((response) => {
            if (response.ok) {
                response.json().then((json) => {
                    positions.forEach((obj, idx) => {
                        const psys = BParticleSystem.Parse(json, (this.gameData.sceneRender as Scene).object, ""),
                              id: number = this.objectid ? this.objectid : parseInt(itemID),
                              pos = obj.pos;

                        psys.name = `particle${id}_${idx}`;

                        psys.worldOffset.x = pos[0];
                        psys.worldOffset.y = pos[1];
                        psys.worldOffset.z = pos[2];

                        psys.preWarmCycles = 80;
                        psys.start();
                    });
                });
            }
        });

        return [BehaviourRetCode.dontKeepBehaviour, [promise]];
    }

}

BehaviourManager.registerFactory(ParticleSystem.name,
    (nbhv: any, gameData: any, objectid?: number, objecttype?: string) => new ParticleSystem(nbhv, gameData, objectid, objecttype)
);
