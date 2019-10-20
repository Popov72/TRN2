import { IMesh } from "./IMesh";

export type indexList = Array<number>;

export interface IMeshBuilder {

    mesh: IMesh;

    skinIndicesList: Array<indexList>;

    setIndex(index: indexList): void;

    makeSkinIndicesList(): void;

    createFaces(faces: Array<any>, matIndex: number): void;

    copyFace(faceIdx: number): any;

    removeFaces(remove: Set<number>): void;

    replaceSkinIndices(remap: any): void;

    copyFacesWithSkinIndex(skinidx: number, newskinidx: number): void;

}
