export type Position = [ number, number, number ];
export type Quaternion = [ number, number, number, number ];

export interface INode {

    readonly position: Position;
    setPosition(pos: Position): void;

    readonly quaternion: Quaternion;
    setQuaternion(quat: Quaternion): void;

    add(obj: INode): void;

    remove(obj: INode): void;

    updateMatrixWorld(): void;

    matrixWorldToArray(arr: Float32Array, ofst: number): void;

    decomposeMatrixWorld(pos: Position, quat: Quaternion): void;
}
