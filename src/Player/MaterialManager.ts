import IGameData from "../Player/IGameData";
import { IMesh } from "../Proxy/IMesh";
import { IMaterial } from "../Proxy/IMaterial";
import { MeshList } from "./ObjectManager";

export class MaterialManager {

    protected _useAdditionalLights: boolean;
    protected sceneData: any;

    constructor() {
        this._useAdditionalLights = false;
    }

    get useAdditionalLights(): boolean {
        return this._useAdditionalLights;
    }

    set useAdditionalLights(u: boolean) {
        this._useAdditionalLights = u;
    }

    public initialize(gameData: IGameData): void {
        this.sceneData = gameData.sceneData;
    }

    public createLightUniformsForObject(obj: IMesh, onlyGlobalLights: boolean): void {
        const materials = obj.materials;
        for (let m = 0; m < materials.length; ++m) {
            this.createLightUniformsForMaterial(materials[m], onlyGlobalLights);
        }
    }

    protected createLightUniformsForMaterial(material: IMaterial, onlyGlobalLights: boolean): void {
        const u = material.uniforms;

        u.numGlobalLight                = { type: "i",   value: 0 };
        u.globalLight_position          = { type: "fv",  value: [0, 0, 0]  };
        u.globalLight_color             = { type: "fv",  value: [0, 0, 0]  };
        u.globalLight_distance          = { type: "fv1", value: [0] };

        if (onlyGlobalLights) {
            return;
        }

        u.numDirectionalLight           = { type: "i",   value: 0 };
        u.directionalLight_direction    = { type: "fv",  value: [0, 0, 0]  };
        u.directionalLight_color        = { type: "fv",  value: [0, 0, 0]  };

        u.numPointLight                 = { type: "i",   value: -1 }; // -1 here means the object is internally lit
        u.pointLight_position           = { type: "fv",  value: [0, 0, 0]  };
        u.pointLight_color              = { type: "fv",  value: [0, 0, 0]  };
        u.pointLight_distance           = { type: "fv1", value: [0] };

        u.numSpotLight                  = { type: "i",   value: 0 };
        u.spotLight_position            = { type: "fv",  value: [0 , 0, 0]  };
        u.spotLight_color               = { type: "fv",  value: [0 , 0, 0]  };
        u.spotLight_distance            = { type: "fv1", value: [0] };
        u.spotLight_direction           = { type: "fv",  value: [0 , 0, 0]  };
        u.spotLight_coneCos             = { type: "fv1", value: [0] };
        u.spotLight_penumbraCos         = { type: "fv1", value: [0] };
    }

    public setUniformsFromRoom(obj: IMesh, roomIndex: number): void {
        const materials = obj.materials,
              roomData = this.sceneData.objects['room' + roomIndex],
              data = this.sceneData.objects[obj.name];

        for (let mat = 0; mat < materials.length; ++mat) {
            const material = materials[mat];

            if (data.type != 'moveable' || !data.internallyLit) {
                material.uniforms.ambientColor.value = roomData.ambientColor;
            }

            this.setLightUniformsForMaterial(roomData, material, false, data.type != 'moveable' || data.internallyLit);

            if (!roomData.flickering) {      material.uniforms.flickerColor.value = [1, 1, 1]; }
            if (roomData.filledWithWater) {  material.uniforms.tintColor.value = [this.sceneData.waterColor.in.r, this.sceneData.waterColor.in.g, this.sceneData.waterColor.in.b]; }

            material.uniformsUpdated();
        }
    }

    protected setLightUniformsForMaterial(room: any, material: IMaterial, noreset: boolean = false, onlyGlobalLights: boolean = false) {
        const u = material.uniforms;

        // global lights created by the Light behaviour
        if (!noreset) {
            u.numGlobalLight.value = 0;
        }

        let lights: Array<any> = room.globalLights;

        if (lights && lights.length > 0) {
            for (let l = 0; l < lights.length; ++l) {
                const light = lights[l];

                if (u.globalLight_position.value === undefined || (!noreset && u.numGlobalLight.value == 0))  { u.globalLight_position.value = []; }
                if (u.globalLight_color.value === undefined || (!noreset && u.numGlobalLight.value == 0))     { u.globalLight_color.value = []; }
                if (u.globalLight_distance.value === undefined || (!noreset && u.numGlobalLight.value == 0))  { u.globalLight_distance.value = []; }

                u.globalLight_position.value = u.globalLight_position.value.concat([light.x, light.y, light.z]);
                u.globalLight_color.value    = u.globalLight_color.value.concat(light.color);
                u.globalLight_distance.value.push(light.fadeOut);

                u.numGlobalLight.value++;
            }
        }

        if (onlyGlobalLights) {
            return;
        }

        // regular room lights
        if (!noreset) {
            u.numDirectionalLight.value = 0;
            u.numPointLight.value       = 0;
            u.numSpotLight.value        = 0;
        }

        lights = this._useAdditionalLights ? room.lightsExt : room.lights;
        if (lights.length == 0) {
            material.uniformsUpdated();
            return;
        }

        for (let l = 0; l < lights.length; ++l) {
            const light = lights[l];

            switch (light.type) {
                case 'directional':
                    if (u.directionalLight_direction.value === undefined || (!noreset && u.numDirectionalLight.value == 0)) { u.directionalLight_direction.value = []; }
                    if (u.directionalLight_color.value === undefined || (!noreset && u.numDirectionalLight.value == 0))     { u.directionalLight_color.value = []; }

                    u.directionalLight_direction.value  = u.directionalLight_direction.value.concat([light.dx, light.dy, light.dz]);
                    u.directionalLight_color.value      = u.directionalLight_color.value.concat(light.color);

                    u.numDirectionalLight.value++;
                    break;
                case 'point':
                    if (u.pointLight_position.value === undefined || (!noreset && u.numPointLight.value == 0))  { u.pointLight_position.value = []; }
                    if (u.pointLight_color.value === undefined || (!noreset && u.numPointLight.value == 0))     { u.pointLight_color.value = []; }
                    if (u.pointLight_distance.value === undefined || (!noreset && u.numPointLight.value == 0))  { u.pointLight_distance.value = []; }

                    u.pointLight_position.value = u.pointLight_position.value.concat([light.x, light.y, light.z]);
                    u.pointLight_color.value    = u.pointLight_color.value.concat(light.color);
                    u.pointLight_distance.value.push(light.fadeOut);

                    u.numPointLight.value++;
                    break;
                case 'spot':
                    if (u.spotLight_position.value === undefined || (!noreset && u.numSpotLight.value == 0))    { u.spotLight_position.value = []; }
                    if (u.spotLight_color.value === undefined || (!noreset && u.numSpotLight.value == 0))       { u.spotLight_color.value = []; }
                    if (u.spotLight_direction.value === undefined || (!noreset && u.numSpotLight.value == 0))   { u.spotLight_direction.value = []; }
                    if (u.spotLight_distance.value === undefined || (!noreset && u.numSpotLight.value == 0))    { u.spotLight_distance.value = []; }
                    if (u.spotLight_coneCos.value === undefined || (!noreset && u.numSpotLight.value == 0))     { u.spotLight_coneCos.value = []; }
                    if (u.spotLight_penumbraCos.value === undefined || (!noreset && u.numSpotLight.value == 0)) { u.spotLight_penumbraCos.value = []; }

                    u.spotLight_position.value  = u.spotLight_position.value.concat([light.x, light.y, light.z]);
                    u.spotLight_color.value     = u.spotLight_color.value.concat(light.color);
                    u.spotLight_direction.value = u.spotLight_direction.value.concat([light.dx, light.dy, light.dz]);
                    u.spotLight_distance.value.push(light.fadeOut);
                    u.spotLight_coneCos.value.push(light.coneCos);
                    u.spotLight_penumbraCos.value.push(light.penumbraCos);

                    u.numSpotLight.value++;
                    break;
            }
        }

        material.uniformsUpdated();
    }

    public setLightUniformsForObject(obj: IMesh): void {
        const data = this.sceneData.objects[obj.name];
        if (data && data.roomIndex >= 0) {
            const materials = obj.materials;

            for (let m = 0; m < materials.length; ++m) {
                const material = materials[m],
                      onlyGlobalLights = !material.uniforms || material.uniforms.numPointLight === undefined || material.uniforms.numPointLight < 0;

                this.setLightUniformsForMaterial(this.sceneData.objects['room' + data.roomIndex], material, false, onlyGlobalLights);
            }
        }
    }

    // update material light uniforms for all `objects`, depending on the room they are in (should be a list of moveables only!)
    public setLightUniformsForObjects(objects: MeshList): void {
        for (const objID in objects) {
            const o = objects[objID],
                  lstObj = Array.isArray(o) ? o : [o];

            for (var i = 0; i < lstObj.length; ++i) {
                this.setLightUniformsForObject(lstObj[i]);
            }
        }
    }

    public getFirstDirectionalLight(lights: Array<any>) {
        for (let i = 0; i < lights.length; ++i) {
            if (lights[i].type == 'directional') {
                return i;
            }
        }
        return -1;
    }

}
