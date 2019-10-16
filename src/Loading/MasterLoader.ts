import Engine from "../Proxy/Engine";
import { IMesh } from "../Proxy/IMesh";
import { IScene } from "../Proxy/IScene";

import { LevelLoader, RawLevel } from "./LevelLoader";
import LevelConverter from "./LevelConverter";

import { ProgressBar } from "../Utils/ProgressBar";

export default class MasterLoader {

	/* trlevel is either:
	 	* a string which is the name of the level to download.
	 	* a JSON object like { data:XXX, name:YYY } where data are the binary data of the TR level and YYY the filename
	 */	
	public static async loadLevel(trlevel: string | any, progressbar: ProgressBar, callbackLevelLoaded: any) {
		progressbar.show();

        const loader = new LevelLoader(),
              converter = new LevelConverter();

		if (typeof(trlevel) != 'string') {
            loader.load(trlevel.data, trlevel.name, trlevel.showTiles);
		} else {
            const blob = await (await fetch(trlevel)).arrayBuffer();

            loader.load(blob, trlevel);
        }

        if (trlevel.showTiles) {
            callbackLevelLoaded(loader.level);
            return;
        }

        converter.convert(loader.level);

        Engine.parseScene(converter.sceneJSON, (scene: IScene) => {
            progressbar.setMessage('Processing...');
            console.log(scene);
            window.setTimeout( () => MasterLoader._postProcessLevel(progressbar, callbackLevelLoaded, converter.sceneJSON, scene), 0);
		});
	}

	private static _postProcessLevel(progressbar: any, callbackLevelLoaded: any, sceneJSON: RawLevel, scene: IScene): void {
		const sceneData = sceneJSON.data, sceneRender = scene;

        sceneData.textures = sceneRender.textures;

        // Set all objects as auto update=false
        // Camera, skies, animated objects will have their matrixAutoUpdate set to true later
		sceneRender.traverse( (obj: any) => {
            obj.matrixAutoUpdate = false;
		});

        const objToRemoveFromScene: Array<IMesh> = [];

        sceneRender.traverse( (obj: IMesh) => {
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

        objToRemoveFromScene.forEach( (obj) => sceneRender.remove(obj) );

		callbackLevelLoaded(sceneJSON, scene);
    }
}
