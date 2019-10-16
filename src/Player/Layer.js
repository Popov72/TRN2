TRN.Layer = function(mainMesh, gameData) {
    this.sceneData = gameData.sceneData;
    this.matMgr = gameData.matMgr;

    this.layers = {};
    
    this.setMesh(TRN.Layer.LAYER.MAIN, mainMesh);
}

TRN.Layer.LAYER = {
    "MAIN":             0,
    "WEAPON":           1,
    "HOLSTER_EMPTY":    2,
    "HOLSTER_FULL":     3,
    "MESHSWAP":         4
};

TRN.Layer.BONE = {
    HIPS:       0,
    LEG_L1:     1,
    LEG_L2:     2,
    LEG_L3:     3,
    LEG_R1:     4,
    LEG_R2:     5,
    LEG_R3:     6,
    CHEST:      7,
    ARM_R1:     8,
    ARM_R2:     9,
    ARM_R3:     10,
    ARM_L1:     11,
    ARM_L2:     12,
    ARM_L3:     13,
    HEAD:       14
};

TRN.Layer.MASK = {
    HIPS:       1 << TRN.Layer.BONE.HIPS,
    LEG_L1:     1 << TRN.Layer.BONE.LEG_L1,
    LEG_L2:     1 << TRN.Layer.BONE.LEG_L2,
    LEG_L3:     1 << TRN.Layer.BONE.LEG_L3,
    LEG_R1:     1 << TRN.Layer.BONE.LEG_R1,
    LEG_R2:     1 << TRN.Layer.BONE.LEG_R2,
    LEG_R3:     1 << TRN.Layer.BONE.LEG_R3,
    CHEST:      1 << TRN.Layer.BONE.CHEST,
    ARM_R1:     1 << TRN.Layer.BONE.ARM_R1,
    ARM_R2:     1 << TRN.Layer.BONE.ARM_R2,
    ARM_R3:     1 << TRN.Layer.BONE.ARM_R3,
    ARM_L1:     1 << TRN.Layer.BONE.ARM_L1,
    ARM_L2:     1 << TRN.Layer.BONE.ARM_L2,
    ARM_L3:     1 << TRN.Layer.BONE.ARM_L3,
    HEAD:       1 << TRN.Layer.BONE.HEAD
};

Object.assign(TRN.Layer.MASK, {
    ARM_L:      TRN.Layer.MASK.ARM_L1 | TRN.Layer.MASK.ARM_L2 | TRN.Layer.MASK.ARM_L3,
    ARM_R:      TRN.Layer.MASK.ARM_R1 | TRN.Layer.MASK.ARM_R2 | TRN.Layer.MASK.ARM_R3,
    LEG_L:      TRN.Layer.MASK.LEG_L1 | TRN.Layer.MASK.LEG_L2 | TRN.Layer.MASK.LEG_L3,
    LEG_R:      TRN.Layer.MASK.LEG_R1 | TRN.Layer.MASK.LEG_R2 | TRN.Layer.MASK.LEG_R3,
    BRAID:      TRN.Layer.MASK.HEAD   | TRN.Layer.MASK.CHEST  | TRN.Layer.MASK.ARM_L1 | TRN.Layer.MASK.ARM_L2 | TRN.Layer.MASK.ARM_R1 | TRN.Layer.MASK.ARM_R2
});

Object.assign(TRN.Layer.MASK, {
    UPPER:      TRN.Layer.MASK.CHEST  | TRN.Layer.MASK.ARM_L  | TRN.Layer.MASK.ARM_R,       // without head
    LOWER:      TRN.Layer.MASK.HIPS   | TRN.Layer.MASK.LEG_L  | TRN.Layer.MASK.LEG_R
});

Object.assign(TRN.Layer.MASK, {
    ALL:        TRN.Layer.MASK.UPPER  | TRN.Layer.MASK.LOWER  | TRN.Layer.MASK.HEAD
});

TRN.Layer.prototype = {

    constructor : TRN.Layer,

    isEmpty : function(layerIndex) {
        return this.layers[layerIndex] === undefined;
    },

    getMesh : function(layerIndex) {
        return this.layers[layerIndex] ? this.layers[layerIndex].mesh : null;
    },

    setMesh : function(layerIndex, mesh, mask) {
        if (mask === undefined) {
            mask = TRN.Layer.MASK.ALL;
        }

        this.layers[layerIndex] = { "mesh":mesh, "mask":mask };

        if (!mesh.geometry.userData.skinIndices) {
            new TRN.MeshBuilder(mesh).makeSkinIndicesList();
        }

        if (layerIndex != TRN.Layer.LAYER.MAIN) {
            const mainMesh = this.layers[TRN.Layer.LAYER.MAIN].mesh;
            
            this._setSkeleton(mesh, this.sceneData.objects[mainMesh.name].skeleton);
            this.setRoom(this.sceneData.objects[mainMesh.name].roomIndex, mesh);
        }

        this.setMask(mesh, mask);
    },

    updateMask : function(layerIndex, mask) {
        const layer = this.layers[layerIndex];

        if (!layer) {
            return;
        }

        layer.mask = layer.mask ^ mask;

        this.setMask(layer.mesh, layer.mask);
    },

    setMask : function(mesh, mask) {
        const geometry = mesh.geometry;
        
        let idx = 0,
            indices = [],
            skinIndices = geometry.userData.skinIndices,
            numMaxBones = skinIndices.length;

        while (mask && idx < numMaxBones) {
            const bit = mask & 1;

            if (bit && skinIndices[idx] !== undefined) {
                indices = indices.concat(skinIndices[idx]);
            }

            mask = mask >> 1;

            idx++;
        }

        mesh.geometry.setIndex(indices);
    },

    update : function() {
        const position = this.layers[TRN.Layer.LAYER.MAIN].mesh.position,
              quaternion = this.layers[TRN.Layer.LAYER.MAIN].mesh.quaternion;
        for (let i in this.layers) {
            if (i != TRN.Layer.LAYER.MAIN) {
                this.layers[i].mesh.position.set(position.x, position.y, position.z);
                this.layers[i].mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
            }
        }
    },

    setBoundingObjects : function() {
        const mainGeometry = this.layers[TRN.Layer.LAYER.MAIN].mesh.geometry;
        for (let i in this.layers) {
            const mesh = this.layers[i].mesh;
            if (i != TRN.Layer.LAYER.MAIN) {
                mesh.geometry.boundingBox = mainGeometry.boundingBox;
                this.layers[i].mesh.geometry.boundingSphere = mainGeometry.boundingSphere;
                if (mesh.boxHelper) {
                    mesh.boxHelper.box = mainGeometry.boundingBox;
                }
            }
        }
    },

    setRoom : function(roomIndex, mesh) {
        if (mesh) {
            this.sceneData.objects[mesh.name].roomIndex = roomIndex;
            this.matMgr.setUniformsFromRoom(mesh, roomIndex);
        } else {
            for (let i in this.layers) {
                const mesh = this.layers[i].mesh;
                if (i != TRN.Layer.LAYER.MAIN) {
                    this.sceneData.objects[mesh.name].roomIndex = roomIndex;
                    this.matMgr.setUniformsFromRoom(mesh, roomIndex);
                }
            }
        }
    },

    _setSkeleton : function(mesh, skeleton) {
        for (let m = 0; m < mesh.material.length; ++m) {
            const material = mesh.material[m];
            
            material.uniforms.boneMatrices.value = skeleton.getBoneMatrices();
        }

        this.sceneData.objects[mesh.name].skeleton = skeleton;
    }

}
