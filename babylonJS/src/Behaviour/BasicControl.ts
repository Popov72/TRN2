import { Scene as BScene, PointerEventTypes } from "babylonjs";

import { BasicControl as BasicControlBase } from "../../../src/Behaviour/BasicControl";
import { BehaviourManager } from "../../../src/Behaviour/BehaviourManager";
import IGameData from "../../../src/Player/IGameData";

import Scene from "../Scene";

export class BasicControl extends BasicControlBase {

    public name: string = BasicControl.name;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        const sceneRender: BScene = (gameData.sceneRender as Scene).object;

        sceneRender.onPointerObservable.add((pointerInfo) => {

            switch (pointerInfo.type) {

                case PointerEventTypes.POINTERDOWN:
                    this.mousedown (pointerInfo as unknown as MouseEvent);
                    break;

                case PointerEventTypes.POINTERMOVE:
                    this.mousemove (pointerInfo as unknown as MouseEvent);
                    break;

            }

        });

    }
}

BehaviourManager.registerFactory(BasicControl.name,
    (nbhv: any, gameData: any, objectid?: number, objecttype?: string) => new BasicControl(nbhv, gameData, objectid, objecttype)
);
