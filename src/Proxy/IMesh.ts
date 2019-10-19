import { Behaviour } from "../Behaviour/Behaviour";
import { Box3 } from "../Utils/Box3";

import { IMaterial } from "./IMaterial";
import { Position, Quaternion } from "./INode";

export function isMesh(obj: any): obj is IMesh {

        return obj.materials !== undefined;

}

export interface IMesh {

    behaviours: Array<Behaviour>;
    materials: Array<IMaterial>;

    readonly position: Position;
    setPosition(pos: Position): void;

    readonly quaternion: Quaternion;
    setQuaternion(quat: Quaternion): void;

    matrixAutoUpdate: boolean; // the setter should update the local model matrix each time it is called
    name: string;
    visible: boolean;
    renderOrder: number;

    updateMatrixWorld(): void;

    containsPoint(pos: Position): boolean;

    showBoundingBox(show: boolean): void;

    clone(): IMesh;

    getBoundingBox(): Box3;

    setBoundingBox(box: Box3): void;
}
