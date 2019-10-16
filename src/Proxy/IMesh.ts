import { Behaviour } from "../Behaviour/Behaviour";

import { IMaterial } from "./IMaterial";

export type Position = [ number, number, number ];
export type Quaternion = [ number, number, number, number ];

export interface IMesh {

    behaviours: Array<Behaviour>;
    materials: Array<IMaterial>;

    readonly position: Position;
    setPosition(pos: Position): void;

    readonly quaternion: Quaternion;
    setQuaternion(quat: Quaternion): void;

    matrixAutoUpdate: boolean;
    name: string;
    visible: boolean;

    add(obj: IMesh): void;

    remove(obj: IMesh): void;

    updateMatrixWorld(): void;

    containsPoint(pos: Position): boolean;

    showBoundingBox(show: boolean): void;
}
