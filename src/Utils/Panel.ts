import { IRenderer } from "../Proxy/IRenderer";
import IGameData from "../Player/IGameData";
import { CutScene } from "../Behaviour/CutScene";

export class Panel {

    protected _parent:      IGameData;
    protected _renderer:    IRenderer;
    protected _elem:        JQuery<any>;
    protected _show:        boolean;

    constructor(domElement: Element, gameData: IGameData, renderer: IRenderer) {
        this._elem = jQuery('');
        this._parent = gameData;
        this._renderer = renderer;
        this._show = false;

        fetch('/resources/template/panel.html').then((response) => {
            response.text().then((html) => {
                this._elem = jQuery(html);
                this._elem.appendTo(domElement);
                this.bindEvents(this);
                this._setState();
            });
        });
    }

    public show(): void {
        this._show = true;
        this._setState();
    }

    public hide(): void {
        this._show = false;
        this._setState();
    }

    public get noSound(): boolean {
        return this._elem.find('#nosound').prop('checked');
    }

    public showInfo(): void {
        const sceneData = this._parent.sceneData, camera = this._parent.camera, perfData = this._renderer.getPerfData([this._parent.sceneRender, this._parent.sceneBackground]);
        const regularLights = this._parent.curRoom == -1 ? 0 : (this._parent.matMgr.useAdditionalLights ? sceneData.objects['room' + this._parent.curRoom].lightsExt.length : sceneData.objects['room' + this._parent.curRoom].lights.length);
        const globalLights = this._parent.curRoom == -1 || !sceneData.objects['room' + this._parent.curRoom].globalLights ? 0 : sceneData.objects['room' + this._parent.curRoom].globalLights.length;

        this._elem.find('#currentroom').html(this._parent.curRoom.toString());
        this._elem.find('#numlights').html('' + regularLights + " - " + globalLights);
        this._elem.find('#camerapos').html(camera.position[0].toFixed(5) + ',' + camera.position[1].toFixed(5) + ',' + camera.position[2].toFixed(5));
        this._elem.find('#camerarot').html(camera.quaternion[0].toFixed(5) + ',' + camera.quaternion[1].toFixed(5) + ',' + camera.quaternion[2].toFixed(5) + ',' + camera.quaternion[3].toFixed(5));
        if (perfData) {
            this._elem.find('#renderinfo').html(perfData.numDrawCalls + ' / ' + perfData.numFaces + ' / ' + perfData.numObjects + ' / ' + perfData.numParticles);
            this._elem.find('#memoryinfo').html(perfData.numGeometries + ' / ' + perfData.numPrograms + ' / ' + perfData.numTextures);
        }
    }

    public updateFromParent(): void {
        this._elem.find('#singleroommode').prop('checked', this._parent.singleRoomMode);
        this._elem.find('#useaddlights').prop('checked', this._parent.matMgr.useAdditionalLights);
    }

    public bindEvents(This: Panel) {

        this._elem.find('#singleroommode').on('click', function() {
            This._parent.singleRoomMode = this.checked;
        });

        this._elem.find('#wireframemode').on('click', function() {
            var scene = This._parent.sceneRender;
            scene.traverse((obj) => {
                const materials = obj.materials;
                for (let i = 0; i < materials.length; ++i) {
                    const material = materials[i];
                    ((material as any).material).wireframe = this.checked;
                }
            });
        });

        this._elem.find('#usefog').on('click', function() {
            var scene = This._parent.sceneRender;
            scene.traverse((obj) => {
                const materials = obj.materials;
                for (let i = 0; i < materials.length; ++i) {
                    const material = materials[i];
                    if (material.uniforms && material.uniforms.useFog) {
                        material.uniforms.useFog.value = this.checked ? 1 : 0;
                        material.uniformsUpdated(["useFog"]);
                    }
                }
            });
        });

        this._elem.find('#nolights').on('click', function() {
            const scene = This._parent.sceneRender,
                  white = [1, 1, 1];
            scene.traverse((obj) => {
                const materials = obj.materials;
                for (let i = 0; i < materials.length; ++i) {
                    const material = materials[i];
                    if (!material.uniforms || material.uniforms.numPointLight === undefined) { return; }
                    if ((material as any).__savenum === undefined) {
                        (material as any).__savenum = material.uniforms.numPointLight.value;
                        (material as any).__saveambient = material.uniforms.ambientColor.value;
                    }
                    material.uniforms.numPointLight.value = this.checked ? 0 : (material as any).__savenum;
                    material.uniforms.ambientColor.value = this.checked ? white : (material as any).__saveambient;

                    material.uniformsUpdated(["numPointLight", "ambientColor"]);
                }
            });
        });

        this._elem.find('#showboundingboxes').on('click', function() {
            const scene = This._parent.sceneRender;

            scene.traverse((obj) => {
                if (obj.materials.length == 0) { return; }

                obj.showBoundingBox(this.checked);
            });
        });

        this._elem.find('#showportals').on('click', function() {
            const scene = This._parent.sceneRender,
                  sceneData = This._parent.sceneData;
            scene.traverse((obj) => {
                const data = sceneData.objects[obj.name];

                if (!data || data.type != 'room' && data.meshPortals) { return; }

                const portals = data.meshPortals;

                if (!portals) { return; }

                for (let i = 0; i < portals.length; ++i) {
                    portals[i].visible = this.checked;
                }
            });
        });

        this._elem.find('#fullscreen').on('click', function() {
            if (document.fullscreenElement != null) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            } else if (document.body.requestFullscreen) {
                document.body.requestFullscreen();
            }
        });

        this._elem.find('#useqwerty').on('click', function() {
            const bc = This._parent.bhvMgr.getBehaviour("BasicControl");
            if (bc === undefined) { return; }
            const states = (bc[0] as any).states,
                  STATES = (bc[0] as any).STATES;
            if (this.checked) {
                states[87] = {state: STATES.FORWARD, on: false}; // W
                states[65] = {state: STATES.LEFT,    on: false}; // A
                delete states[90]; // Z
                delete states[81]; // Q
            } else {
                states[90] = {state: STATES.FORWARD, on: false}; // W
                states[81] = {state: STATES.LEFT,    on: false}; // A
                delete states[87]; // W
                delete states[65]; // A
            }
        });

        this._elem.find('#noobjecttexture').on('click', function() {
            const shaderMgr = This._parent.shdMgr,
                  scene = This._parent.sceneRender,
                  shader = shaderMgr.getFragmentShader('TR_uniformcolor');
            shader.then((code: string) => {
                scene.traverse((obj) => {
                    if (obj.name.match(/moveable|sprite|staticmesh/) == null) { return; }

                    const materials = obj.materials;
                    for (let i = 0; i < materials.length; ++i) {
                        const material = materials[i], origFragmentShader = (material as any).origFragmentShader;
                        if (!origFragmentShader) {
                            (material as any).origFragmentShader = material.fragmentShader;
                        }

                        material.fragmentShader = this.checked ? code : (material as any).origFragmentShader;
                    }
                });
            });
        });

        this._elem.find('#lowlightsquality').on('click', async function() {
            const shaderMgr = This._parent.shdMgr,
                  scene = This._parent.sceneRender;

            shaderMgr.globalLightsInFragment = !this.checked;

            const shaders = [await shaderMgr.getFragmentShader('TR_standard', true), await shaderMgr.getVertexShader('TR_room', true), await shaderMgr.getVertexShader('TR_moveable', true), await shaderMgr.getVertexShader('TR_mesh', true)];

            await Promise.all(shaders);

            scene.traverse((obj) => {
                const vshader =
                        obj.name.startsWith("moveable")     ? shaders[2] :
                        obj.name.startsWith("room")         ? shaders[1] :
                        obj.name.startsWith("staticmesh")   ? shaders[3] : '';

                if (vshader === '') { return; }

                const materials = obj.materials;
                for (let i = 0; i < materials.length; ++i) {
                    const material = materials[i], origFragmentShader = (material as any).origFragmentShader, origVertexShader = (material as any).origVertexShader;
                    if (!origFragmentShader) {
                        (material as any).origFragmentShader = material.fragmentShader;
                    }
                    if (!origVertexShader) {
                        (material as any).origVertexShader = material.vertexShader;
                    }

                    material.vertexShader = this.checked ? vshader : (material as any).origVertexShader;
                    material.fragmentShader = this.checked ? shaders[0] : (material as any).origFragmentShader;
                }
            });
        });

        this._elem.find('#nobumpmapping').on('click', function() {
            const scene = This._parent.sceneRender;
            scene.traverse((obj) => {
                const data = This._parent.sceneData.objects[obj.name];

                if (!data || data.type != "room") { return; }

                const materials = obj.materials;
                for (let i = 0; i < materials.length; ++i) {
                    const material = materials[i],
                          s = material.uniforms.offsetBump.value[2];

                    material.uniforms.offsetBump.value[2] = material.uniforms.offsetBump.value[3];
                    material.uniforms.offsetBump.value[3] = s;

                    material.uniformsUpdated(['offsetBump']);
                }
            });
        });

        this._elem.find('#useaddlights').on('click', function() {
            This._parent.matMgr.useAdditionalLights = this.checked;
            This._parent.matMgr.setLightUniformsForObjects(This._parent.objMgr.objectList['moveable']);
        });

        const prefix = ['', 'webkit', 'moz'];
        for (let i = 0; i < prefix.length; ++i) {
            document.addEventListener(prefix[i] + "fullscreenchange", function() {
                This._elem.find('#fullscreen').prop('checked', document.fullscreenElement != null);
            }, false);
        }

        this._elem.find('#nosound').on('click', function() {
            const cutscene = (This._parent.bhvMgr.getBehaviour("CutScene") as Array<CutScene>);
            if (cutscene && cutscene.length > 0) {
                cutscene[0].setVolume(this.checked ? 0 : 1);
            }
        });

    }

    protected _setState(): void {
        this._elem.css('display', this._show ? 'block' : 'none');
        jQuery("#stats").css('display', this._show ? 'block' : 'none');
    }

}
