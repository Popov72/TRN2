import { IMesh } from "./IMesh";

export type skinIndices = Array<number>;

export interface IMeshBuilder {

    mesh: IMesh;

    skinIndicesList: Array<skinIndices>;

    setIndex(index: skinIndices): void;

    makeSkinIndicesList(): void;

}
