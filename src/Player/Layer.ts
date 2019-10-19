import { IMesh } from "../Proxy/IMesh";
import { IMeshBuilder, skinIndices } from "../Proxy/IMeshBuilder";
import IGameData from "../Player/IGameData";
import { MaterialManager } from "./MaterialManager";
import Engine from "../Proxy/Engine";
import Skeleton from "../Player/Skeleton";

export enum LAYER {
    MAIN            = 0,
    WEAPON          = 1,
    HOLSTER_EMPTY   = 2,
    HOLSTER_FULL    = 3,
    MESHSWAP        = 4,
};

export enum BONE {
    HIPS    = 0,
    LEG_L1  = 1,
    LEG_L2  = 2,
    LEG_L3  = 3,
    LEG_R1  = 4,
    LEG_R2  = 5,
    LEG_R3  = 6,
    CHEST   = 7,
    ARM_R1  = 8,
    ARM_R2  = 9,
    ARM_R3  = 10,
    ARM_L1  = 11,
    ARM_L2  = 12,
    ARM_L3  = 13,
    HEAD    =  14,
};

export enum MASK {
    HIPS    =  1 << BONE.HIPS,
    LEG_L1  =  1 << BONE.LEG_L1,
    LEG_L2  =  1 << BONE.LEG_L2,
    LEG_L3  =  1 << BONE.LEG_L3,
    LEG_R1  =  1 << BONE.LEG_R1,
    LEG_R2  =  1 << BONE.LEG_R2,
    LEG_R3  =  1 << BONE.LEG_R3,
    CHEST   =  1 << BONE.CHEST,
    ARM_R1  =  1 << BONE.ARM_R1,
    ARM_R2  =  1 << BONE.ARM_R2,
    ARM_R3  =  1 << BONE.ARM_R3,
    ARM_L1  =  1 << BONE.ARM_L1,
    ARM_L2  =  1 << BONE.ARM_L2,
    ARM_L3  =  1 << BONE.ARM_L3,
    HEAD    =  1 << BONE.HEAD,

    ARM_L   =   ARM_L1 | ARM_L2 | ARM_L3,
    ARM_R   =   ARM_R1 | ARM_R2 | ARM_R3,
    LEG_L   =   LEG_L1 | LEG_L2 | LEG_L3,
    LEG_R   =   LEG_R1 | LEG_R2 | LEG_R3,
    BRAID   =   HEAD   | CHEST  | ARM_L1 | ARM_L2 | ARM_R1 | ARM_R2,

    UPPER   =   CHEST  | ARM_L  | ARM_R,       // without head
    LOWER   =   HIPS   | LEG_L  | LEG_R,

    ALL     =   0xFFFFFFFF,
};

interface ALayer {
    meshb: IMeshBuilder;
    mask:  number;
}

export class Layer {

    protected sceneData:    any;
    protected matMgr:       MaterialManager;
    protected layers:       Map<number, ALayer>;

    constructor(mainMesh: IMesh, gameData: IGameData) {
        this.sceneData = gameData.sceneData;
        this.matMgr = gameData.matMgr;

        this.layers = new Map();
        
        this.setMesh(LAYER.MAIN, mainMesh);
    }

    public isEmpty(layerIndex: number): boolean {
        return this.layers.get(layerIndex) === undefined;
    }

    public getMesh(layerIndex: number): IMesh | null {
        const layer = this.layers.get(layerIndex);

        return layer ? layer.meshb.mesh : null;
    }

    public getMeshBuilder(layerIndex: number): IMeshBuilder | null {
        const layer = this.layers.get(layerIndex);

        return layer ? layer.meshb : null;
    }

    public setMesh(layerIndex: number, mesh: IMesh, mask?: number): void {
        if (mask === undefined) {
            mask = MASK.ALL;
        }

        const mb = Engine.makeMeshBuilder(mesh);

        this.layers.set(layerIndex, { "meshb": mb, "mask": mask });

        mb.makeSkinIndicesList();

        if (layerIndex !== LAYER.MAIN) {
            const mainMesh = this.layers.get(LAYER.MAIN)!.meshb.mesh;
            
            this._setSkeleton(mesh, this.sceneData.objects[mainMesh.name].skeleton);
            this.setRoom(this.sceneData.objects[mainMesh.name].roomIndex, mesh);
        }

        this.setMask(mb, mask);

        mesh.visible = true;
    }

    public updateMask(layerIndex: number, mask: number): void {
        const layer = this.layers.get(layerIndex);

        if (!layer) {
            return;
        }

        layer.mask = layer.mask ^ mask;

        this.setMask(layer.meshb, layer.mask);
    }

    public setMask(meshb: IMeshBuilder, mask: number): void {
        let idx = 0,
            indices: skinIndices = [],
            skinIndices = meshb.skinIndicesList,
            numMaxBones = skinIndices.length;

        while (mask && idx < numMaxBones) {
            const bit = mask & 1;

            if (bit && skinIndices[idx] !== undefined) {
                indices = indices.concat(skinIndices[idx]);
            }

            mask = mask >> 1;

            idx++;
        }

        meshb.setIndex(indices);
    }

    public update(): void {
        const position = this.layers.get(LAYER.MAIN)!.meshb.mesh.position,
              quaternion = this.layers.get(LAYER.MAIN)!.meshb.mesh.quaternion,
              it = this.layers.entries();

        for (const [i, layer] of it) {
            if (i != LAYER.MAIN) {
                layer.meshb.mesh.setPosition(position);
                layer.meshb.mesh.setQuaternion(quaternion);
            }
        }
    }

    public setBoundingObjects(): void {
        const mainBbox = this.layers.get(LAYER.MAIN)!.meshb.mesh.getBoundingBox(),
              it = this.layers.entries();

        for (let [i, layer] of it) {
            const mesh = layer.meshb.mesh;
            if (i != LAYER.MAIN) {
                mesh.setBoundingBox(mainBbox);
            }
        }
    }

    public setRoom(roomIndex: number, mesh?: IMesh): void {
        if (mesh) {
            this.sceneData.objects[mesh.name].roomIndex = roomIndex;
            this.matMgr.setUniformsFromRoom(mesh, roomIndex);
        } else {
            const it = this.layers.entries();
            for (let [i, layer] of it) {
                const mesh = layer.meshb.mesh;
                if (i != LAYER.MAIN) {
                    this.sceneData.objects[mesh.name].roomIndex = roomIndex;
                    this.matMgr.setUniformsFromRoom(mesh, roomIndex);
                }
            }
        }
    }

    protected _setSkeleton(mesh: IMesh, skeleton: Skeleton) {
        for (let m = 0; m < mesh.materials.length; ++m) {
            const material = mesh.materials[m];
            
            material.uniforms.boneMatrices.value = skeleton.boneMatrices
            
            material.uniformsUpdated(["boneMatrices"]);
        }

        this.sceneData.objects[mesh.name].skeleton = skeleton;
    }

}
