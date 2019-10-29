import Engine from "../Proxy/Engine";
import { ICamera } from "../Proxy/ICamera";
import { IMesh } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";
import { Behaviour, BehaviourRetCode } from "./Behaviour";
import { BehaviourManager } from "./BehaviourManager";

export class Light extends Behaviour {

    public name: string = Light.name;

    private static __numInstances = 0;

    protected _lstObjs: Array<IMesh>;
    protected _color: Array<number>;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this._lstObjs = <any>null;
        this._color = [0, 0, 0];
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {
        const color = this.nbhv.color, range = parseInt(this.nbhv.range.max);

        if (lstObjs == null) {
            return [BehaviourRetCode.dontKeepBehaviour, null];
        }

        this._color = [parseFloat(color.r) / 255, parseFloat(color.g) / 255, parseFloat(color.b) / 255];

        this._lstObjs = lstObjs as Array<IMesh>;

        this._lstObjs.forEach((obj) => {
            const roomIndex = this.gameData.sceneData.objects[obj.name].roomIndex,
                  roomData = this.gameData.sceneData.objects['room' + roomIndex];

            let globalLights: Array<any> = roomData.globalLights;

            if (!globalLights) {
                globalLights = [];
                roomData.globalLights = globalLights;
            }

            globalLights.push({
                "x": obj.position[0],
                "y": obj.position[1],
                "z": obj.position[2],
                "color": this._color,
                "fadeOut": range,
            });

            Light.__numInstances++;
        });

        return [BehaviourRetCode.keepBehaviour, null];
    }

    protected static canLightRoom(roomMesh: IMesh, light: any): boolean {
        const meshb = Engine.makeMeshBuilder(roomMesh),
              vertices = meshb.vertices,
              numVertices = vertices.length / 3,
              lx = light.x, ly = light.y, lz = light.z, fadeOut2 = light.fadeOut * light.fadeOut;

        for (let v = 0; v < numVertices; ++v) {
            const x = vertices[v * 3 + 0],
                  y = vertices[v * 3 + 1],
                  z = vertices[v * 3 + 2];

            const dist2 = (x - lx) * (x - lx) + (y - ly) * (y - ly) + (z - lz) * (z - lz);

            if (dist2 < fadeOut2) {
                return true;
            }
        }

        return false;
    }

    public static onEngineInitialized(gameData: IGameData): void {
        if (Light.__numInstances == 0) {
            return;
        }

        // Loop through the global lights of each room.
        // If a light can light an adjoining room, add this light to the global light list of this room
        const sceneData = gameData.sceneData,
              objRooms: any = gameData.objMgr.objectList['room'],
              trRooms = gameData.trlvl.trlevel.rooms;

        for (let r = 0; r < trRooms.length; ++r) {
            const trRoom = trRooms[r],
                  portals = trRoom.portals,
                  globalLights = sceneData.objects['room' + r].globalLights;

            if (!globalLights || portals.length == 0) { continue; }

            for (let g = 0; g < globalLights.length; ++g) {
                const globalLight = globalLights[g];

                if (!globalLight.roomList) {
                    globalLight.roomList = new Set<number>(); // list of rooms this light is
                    globalLight.roomList.add(r);
                }

                // let's see if this light can light the rooms reachable through the portals of the current room
                // if yes, add this light to those other rooms
                for (let p = 0; p < portals.length; ++p) {
                    const adjRoom = portals[p].adjoiningRoom;

                    if (globalLight.roomList.has(adjRoom)) { continue; } // the light is already in the adjoining room

                    if (Light.canLightRoom(objRooms[adjRoom] as IMesh, globalLight)) {
                        let glights = sceneData.objects['room' + adjRoom].globalLights;
                        if (!glights) {
                            glights = [];
                            sceneData.objects['room' + adjRoom].globalLights = glights;
                        }
                        glights.push(globalLight);
                        globalLight.roomList.add(adjRoom);
                    }
                }
            }
        }

        // make sure all global lights are set for each room
        for (let r = 0; r < trRooms.length; ++r) {
            const oroom = objRooms[r] as IMesh;
            gameData.matMgr.setUniformsFromRoom(oroom, r);
        }
    }

}

BehaviourManager.registerFactory(Light);
