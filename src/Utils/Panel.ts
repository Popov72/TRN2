import IGameData from "../Player/IGameData";
import { IRenderer } from "../Proxy/IRenderer";

export class Panel {

    protected _parent: IGameData;
    protected renderer: IRenderer;
    protected elem: JQuery<any>;

    constructor(domElement: Element, gameData: IGameData, renderer: IRenderer) {
        let html: any;

        this._parent = gameData;
        this.renderer = renderer;

        jQuery.ajax({
            type: "GET",
            url: '/resources/template/panel.html',
            dataType: "html",
            cache: false,
            async: false
        }).done(function(data) { html = data; });

        this.elem = jQuery(html);

        this.elem.appendTo(domElement);

        this.bindEvents();
    }

	public show(): void {
		this.elem.css('display', 'block');
        jQuery("#stats").css('display', 'block');
    }
    
	public hide(): void {
		this.elem.css('display', 'none');
        jQuery("#stats").css('display', 'none');
	}

	public showInfo(): void {
		const sceneData = this._parent.sceneData, camera = this._parent.camera, perfData = this.renderer.getPerfData([this._parent.sceneRender, this._parent.sceneBackground]);

		this.elem.find('#currentroom').html(this._parent.curRoom.toString());
		this.elem.find('#numlights').html(this._parent.curRoom != -1 ? (this._parent.matMgr.useAdditionalLights ? sceneData.objects['room'+this._parent.curRoom].lightsExt.length : sceneData.objects['room'+this._parent.curRoom].lights.length) : '');
        this.elem.find('#camerapos').html(camera.position[0].toFixed(5)+','+camera.position[1].toFixed(5)+','+camera.position[2].toFixed(5));
        this.elem.find('#camerarot').html(camera.quaternion[0].toFixed(5)+','+camera.quaternion[1].toFixed(5)+','+camera.quaternion[2].toFixed(5)+','+camera.quaternion[3].toFixed(5));
        if (perfData) {
            this.elem.find('#renderinfo').html(perfData.numDrawCalls + ' / ' + perfData.numFaces + ' / ' + perfData.numObjects);
            this.elem.find('#memoryinfo').html(perfData.numGeometries + ' / ' + perfData.numPrograms + ' / ' + perfData.numTextures);
        }
	}

    public updateFromParent(): void {
        this.elem.find('#singleroommode').prop('checked', this._parent.singleRoomMode);
        this.elem.find('#useaddlights').prop('checked', this._parent.matMgr.useAdditionalLights);
    }

	public bindEvents() {
		const this_ = this;

		this.elem.find('#singleroommode').on('click', function() {
            this_._parent.singleRoomMode = this.checked;
		});

		this.elem.find('#wireframemode').on('click', function() {
			var scene = this_._parent.sceneRender;
			scene.traverse( (obj) => {
				const materials = obj.materials;
				for (let i = 0; i < materials.length; ++i) {
					const material = materials[i];
                    ((material as any).material).wireframe = this.checked;
				}
			});
		});

		this.elem.find('#usefog').on('click', function() {
			var scene = this_._parent.sceneRender;
			scene.traverse( (obj) => {
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

		this.elem.find('#nolights').on('click', function() {
            const scene = this_._parent.sceneRender,
                  white = [1, 1, 1];
			scene.traverse( (obj) => {
				const materials = obj.materials;
				for (let i = 0; i < materials.length; ++i) {
                    const material = materials[i];
                    if (!material.uniforms || material.uniforms.numPointLight === undefined) return;
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

		this.elem.find('#showboundingboxes').on('click', function() {
            const scene = this_._parent.sceneRender;

			scene.traverse( (obj) => {
				if (obj.materials.length == 0) return;

                obj.showBoundingBox(this.checked);
            });
		});

		this.elem.find('#showportals').on('click', function() {
            const scene = this_._parent.sceneRender, 
                  sceneData = this_._parent.sceneData;
			scene.traverse( (obj) => {
                const data = sceneData.objects[obj.name];
                
                if (!data || data.type != 'room' && data.meshPortals) return;
                
				const portals = data.meshPortals;

				if (!portals) return;

				for (let i = 0; i < portals.length; ++i) {
                    portals[i].visible = this.checked;
                }
			});
		});

		this.elem.find('#fullscreen').on('click', function() {
			if (document.fullscreenElement != null) {
				if (document.exitFullscreen) 
					document.exitFullscreen();
			} else if (document.body.requestFullscreen) {
				document.body.requestFullscreen();
			}
		});

		this.elem.find('#useqwerty').on('click', function() {
            const bc = this_._parent.bhvMgr.getBehaviour("BasicControl");
            if (bc === undefined) return;
            const states = (bc[0] as any).states,
                  STATES = (bc[0] as any).STATES;
			if (this.checked) {
				states[87] = {state:STATES.FORWARD, on:false}; // W
				states[65] = {state:STATES.LEFT,    on:false}; // A
				delete states[90]; // Z
				delete states[81]; // Q
			} else {
				states[90] = {state:STATES.FORWARD, on:false}; // W
				states[81] = {state:STATES.LEFT,    on:false}; // A
				delete states[87]; // W
				delete states[65]; // A
			}
		});

		this.elem.find('#noobjecttexture').on('click', function() {
			const shaderMgr = this_._parent.shdMgr,
			      scene = this_._parent.sceneRender,
			      shader = shaderMgr.getFragmentShader('uniformcolor');
			scene.traverse( (obj) => {
				if (obj.name.match(/moveable|sprite|staticmesh/) == null) return;

				const materials = obj.materials;
				for (let i = 0; i < materials.length; ++i) {
					const material = materials[i], origFragmentShader = (material as any).origFragmentShader;
					if (!origFragmentShader) {
						(material as any).origFragmentShader = (material as any).fragmentShader;
					}

					(material as any).fragmentShader = this.checked ? shader : (material as any).origFragmentShader;
					(material as any).needsUpdate = true;
				}
			});
		});

		this.elem.find('#nobumpmapping').on('click', function() {
			const scene = this_._parent.sceneRender;
			scene.traverse( (obj) => {
                const data = this_._parent.sceneData.objects[obj.name];
                
				if (!data || data.type != "room") return;

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

		this.elem.find('#useaddlights').on('click', function() {
            this_._parent.matMgr.useAdditionalLights = this.checked;
            this_._parent.matMgr.setLightUniformsForObjects(this_._parent.objMgr.objectList['moveable']);
		});

	    const prefix = ['', 'webkit', 'moz'];
	    for (let i = 0; i < prefix.length; ++i) {
	    	document.addEventListener(prefix[i] + "fullscreenchange", function() {
	    		this_.elem.find('#fullscreen').prop('checked', document.fullscreenElement != null);
	    	}, false);
	    }
	}

}
