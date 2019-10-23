import Engine from "../Proxy/Engine";
import { IMesh } from "../Proxy/IMesh";
import { IScene } from "../Proxy/IScene";

import { ConfigManager } from "../ConfigManager";
import { LevelLoader } from "./LevelLoader";
import LevelConverter from "./LevelConverter";

export default class MasterLoader {

    /* trlevel is either:
	 	* a string which is the name of the level to download.
	 	* a JSON object like { data:XXX, name:YYY } where data are the binary data of the TR level and YYY the filename
	 */
    public static loadLevel(trlevel: string | any, confMgr: ConfigManager): Promise<any> {
        const loader = new LevelLoader(confMgr);

        return new Promise<any>((resolve, reject) => {
            if (typeof(trlevel) != 'string') {
                loader.load(trlevel.data, trlevel.name, trlevel.showTiles);
                resolve(loader.level);
            } else {
                fetch(trlevel).then((response: Response) => {
                    response.arrayBuffer().then((blob) => {
                        loader.load(blob, trlevel);
                        resolve(loader.level);
                    });
                });
            }
        }).then((level) => {
            if (trlevel.showTiles) {
                return Promise.resolve(level);
            }

            const converter = new LevelConverter();

            converter.convert(level);

            const shdMgr = Engine.getShaderMgr();

            shdMgr.setTRLevel(level);

            return Engine.parseScene(converter.sceneJSON).then((scene: IScene) => {
                MasterLoader._postProcessLevel(converter.sceneJSON, scene);

                return Promise.resolve([converter.sceneJSON, scene]);
            });
        });
    }

    private static _postProcessLevel(sceneJSON: any, scene: IScene): void {
        const sceneData = sceneJSON.data, sceneRender = scene;

        sceneData.textures = sceneRender.textures;

        // Set all objects as auto update=false
        // Camera, skies, animated objects will have their matrixAutoUpdate set to true later
        sceneRender.traverse((obj: any) => {
            obj.matrixAutoUpdate = false;
        });

        const objToRemoveFromScene: Array<IMesh> = [];

        sceneRender.traverse((obj: IMesh) => {
            const data = sceneData.objects[obj.name];

            if (data) {
                if ((data.type == 'moveable' || data.type == 'spriteseq' || data.type == 'sprite' || data.type == 'staticmesh') /*&& data.roomIndex < 0*/) {
                    data.liveObj = obj;
                    objToRemoveFromScene.push(obj);
                }

                if (data.type == "camera") {
                    obj.matrixAutoUpdate = true;
                }

                obj.visible = data.visible;
            }
        });

        objToRemoveFromScene.forEach((obj) => sceneRender.remove(obj));
    }
}
