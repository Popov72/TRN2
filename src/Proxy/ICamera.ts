import { Behaviour } from "../Behaviour/Behaviour";

import { Position, Quaternion } from "./INode";

export interface ICamera {

    behaviours: Array<Behaviour>;

    aspect: number;
    fov: number;

    readonly position: Position;
    setPosition(pos: Position): void;

    readonly quaternion: Quaternion;
    setQuaternion(quat: Quaternion): void;

    updateMatrixWorld(): void;

    updateProjectionMatrix(): void;

    lookAt(pos: Position): void;
}
