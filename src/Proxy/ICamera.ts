import { Behaviour } from "../Behaviour/Behaviour";

import { Position, Quaternion } from "./IMesh";

export interface ICamera {

    behaviours: Array<Behaviour>;
    
    aspect: number;

    readonly position: Position;
    setPosition(pos: Position): void;

    readonly quaternion: Quaternion;
    setQuaternion(quat: Quaternion): void;

    updateMatrixWorld(): void;

    updateProjectionMatrix(): void;

}
