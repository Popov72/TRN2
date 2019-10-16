import { ICamera } from "../Proxy/ICamera";
import { IMesh, Quaternion } from "../Proxy/IMesh";
import IGameData from "../Player/IGameData";

import { BehaviourManager } from "./BehaviourManager";
import { Behaviour, BehaviourRetCode } from "./Behaviour";

declare var glMatrix: any;

interface States {
    [n: number]: {
        state: number,
        on: boolean,
    },
}

interface myMap {
    [name: string]: any;
}

export class BasicControl extends Behaviour {

    public name: string = BasicControl.name;

    protected object: IMesh | null;
    protected domElement: Element;
    protected STATES: myMap;
    protected KEYS: myMap;
    protected states: States;
    protected enabled: boolean;
    protected captureMouse: boolean;
    protected factor: number;
    protected moveFactor: number;
    protected rotFactor: number;
    protected mouseRotFactor: number;
    protected _mouseX: number;
    protected _mouseY: number;
    protected _mouseDeltaX: number;
    protected _mouseDeltaY: number;
    protected xSign : number;

    constructor(nbhv: any, gameData: IGameData, objectid?: number, objecttype?: string) {
        super(nbhv, gameData, objectid, objecttype);

        this.STATES = { FASTER:0, FORWARD:1, LEFT:2, RIGHT:3, BACKWARD:4, UP:5, DOWN:6, ROTY:7, ROTNY:8, ROTX:9, ROTNX:10, SLOWER:11 };
        this.KEYS = { MOUSENX:300, MOUSEX:301, MOUSENY:302, MOUSEY:303 };
        this.enabled = true;
        this.captureMouse = false;
        this.object = null;
        this.xSign = 1;
        this.domElement = <any>null;

        this.states = {
            16: {state:this.STATES.FASTER,   on:false}, // SHIFT
            17: {state:this.STATES.SLOWER,   on:false}, // CTRL
            90: {state:this.STATES.FORWARD,  on:false}, // Z
            38: {state:this.STATES.FORWARD,  on:false}, // CURSOR UP
            81: {state:this.STATES.LEFT,     on:false}, // Q
            68: {state:this.STATES.RIGHT,    on:false}, // D
            83: {state:this.STATES.BACKWARD, on:false}, // S
            40: {state:this.STATES.BACKWARD, on:false}, // CURSOR DOWN
            32: {state:this.STATES.UP,       on:false}, // SPACE
            88: {state:this.STATES.DOWN,     on:false}, // X
            37: {state:this.STATES.ROTY,     on:false}, // CURSOR LEFT
            39: {state:this.STATES.ROTNY,    on:false}  // CURSOR RIGHT
        };

        this.states[this.KEYS.MOUSENX] = {state:this.STATES.ROTY,    on:false}; // mouse move -X
        this.states[this.KEYS.MOUSEX]  = {state:this.STATES.ROTNY,   on:false}; // mouse move +X
        this.states[this.KEYS.MOUSENY] = {state:this.STATES.ROTX,    on:false}; // mouse move -Y
        this.states[this.KEYS.MOUSEY]  = {state:this.STATES.ROTNX,   on:false}; // mouse move +Y

        this.factor = 1.0;
        this.moveFactor = 0;
        this.rotFactor = 0;
        this.mouseRotFactor = 0;
        this._mouseX = -1;
        this._mouseY = -1;
        this._mouseDeltaX = this._mouseDeltaY = 0;
    }

    public init(lstObjs: Array<IMesh | ICamera> | null): [BehaviourRetCode, Array<Promise<void>> | null] {

        if (lstObjs == null) {
            return [BehaviourRetCode.dontKeepBehaviour, null];
        }

        const domElement = document.body,
              object = lstObjs[0] as IMesh,
              scale = this.nbhv.scale;

        this.domElement = domElement;
        
        this.object = object;

        this.moveFactor = scale && scale.move ? parseFloat(scale.move) : 6000;
        this.rotFactor = scale && scale.rotation ? parseFloat(scale.rotation) : 100;
        this.mouseRotFactor = scale && scale.mouserotation ? parseFloat(scale.mouserotation) : 10;
        
        const prefix = ['', 'webkit', 'moz'];

        for (let i = 0; i < prefix.length; ++i) {

            document.addEventListener( prefix[i] + "pointerlockchange", this.pointerLockChange.bind(this), false );
            document.addEventListener( prefix[i] + "pointerlocklost", this.pointerLockChange.bind(this), false );

        }

        this.domElement.addEventListener( 'contextmenu', function ( event: Event ) { event.preventDefault(); }, false );
        this.domElement.addEventListener( 'keydown',    this.keydown.bind(this)    as ((evt: Event) => void), false );
        this.domElement.addEventListener( 'keyup',      this.keyup.bind(this)      as ((evt: Event) => void), false );
        this.domElement.addEventListener( 'mousemove',  this.mousemove.bind(this)  as ((evt: Event) => void), false );
        this.domElement.addEventListener( 'mousedown',  this.mousedown.bind(this)  as ((evt: Event) => void), false );

        return [BehaviourRetCode.keepBehaviour, null];
    }
    
    frameStarted (curTime: number, delta: number) {

        if ( this.object === null  ) return;

        let rotX = 0.0, rotY = 0.0, translate = [ 0, 0, 0 ];
        
        let moveScale = this.factor * this.moveFactor * delta;
        let rotScale = this.factor * this.rotFactor * delta;
        let rotMouseScale = this.factor * this.mouseRotFactor * delta;
        
        for (const state in this.states) {

            const ostate = this.states[state], isMouse = (state as unknown as number) >= 300;

            if ( !ostate.on ) continue;
            
            switch ( ostate.state ) {

                case this.STATES.FASTER:
                    moveScale *= 3;
                    rotScale *= 3;
                    rotMouseScale *= 3;
                    break;

                case this.STATES.SLOWER:
                    moveScale /= 3;
                    rotScale /= 3;
                    rotMouseScale /= 3;
                    break;

                case this.STATES.FORWARD:
                    translate[2] = -moveScale * this.xSign;
                    break;

                case this.STATES.BACKWARD:
                    translate[2] = moveScale * this.xSign;
                    break;

                case this.STATES.LEFT:
                    translate[0] = -moveScale * this.xSign;
                    break;

                case this.STATES.RIGHT:
                    translate[0] = moveScale * this.xSign;
                    break;

                case this.STATES.UP:
                    translate[1] = moveScale;
                    break;

                case this.STATES.DOWN:
                    translate[1] = -moveScale;
                    break;

                case this.STATES.ROTY:
                    if (isMouse) {

                        rotY -= this._mouseDeltaX * rotMouseScale;

                    } else {

                        rotY += rotScale;

                    }
                    break;

                case this.STATES.ROTNY:
                    if (isMouse) {

                        rotY -= this._mouseDeltaX * rotMouseScale;

                    } else {

                        rotY -= rotScale;

                    }
                    break;

                case this.STATES.ROTX:
                    if (isMouse) {

                        rotX -= this._mouseDeltaY * rotMouseScale;
                        
                    } else {

                        rotX += rotScale;

                    }
                    break;

                case this.STATES.ROTNX:
                    if (isMouse) {

                        rotX -= this._mouseDeltaY * rotMouseScale;

                    } else {

                        rotX -= rotScale;

                    }
                    break;

            }
        }

        this._mouseDeltaX = this._mouseDeltaY = 0;

        if ( this.states[ this.KEYS.MOUSENX ]) this.states[ this.KEYS.MOUSENX ].on = false;
        if ( this.states[ this.KEYS.MOUSEX ])  this.states[ this.KEYS.MOUSEX ].on  = false;
        if ( this.states[ this.KEYS.MOUSENY ]) this.states[ this.KEYS.MOUSENY ].on = false;
        if ( this.states[ this.KEYS.MOUSEY ])  this.states[ this.KEYS.MOUSEY ].on  = false;
        
        if (rotX == 0 && rotY == 0 && translate[0] == 0 && translate[1] == 0 && translate[2] == 0) {
            return;
        }
        
        let q = [ 0, 0, 0, 0 ];
        let quat: Quaternion = this.object.quaternion;

        glMatrix.quat.setAxisAngle( q, [ 0, 1, 0 ], glMatrix.glMatrix.toRadian( rotY ) );
        glMatrix.quat.multiply( quat, q, quat );

        let v = [ this.xSign, 0, 0 ];

        glMatrix.vec3.transformQuat( v, v, quat );

        glMatrix.quat.setAxisAngle( q, v, glMatrix.glMatrix.toRadian( rotX ) );
        glMatrix.quat.mul( quat, q, quat );
        
        glMatrix.vec3.transformQuat( v, translate, quat );

        this.object.setQuaternion( quat );

        let pos = this.object.position;

        this.object.setPosition([pos[0] + v[0], pos[1] + v[1], pos[2] + v[2]]);

    }

    protected pointerLockChange (): void {

        var locked = document.pointerLockElement == this.domElement; 
        this.captureMouse = locked;

    }

    protected keydown ( event: KeyboardEvent ): void {

        if ( this.enabled === false ) return;

        if ( this.states[event.keyCode] ) {

            this.states[ event.keyCode ].on = true;

            event.preventDefault();
            event.stopPropagation();

        }

    }

    protected keyup ( event: KeyboardEvent ): void {

        if ( this.enabled === false ) return;

        if ( this.states[ event.keyCode ] ) {

            this.states[ event.keyCode ].on = false;

            event.preventDefault();
            event.stopPropagation();

        }

    }
    
    protected mousemove ( _event: MouseEvent ): void {

        let event: any = _event;

        if ( event.event ) event = event.event;

        if ( document.pointerLockElement ) {

            const mx = event.movementX/* || event.webkitMovementX || event.mozMovementX || 0*/;
            const my = event.movementY/* || event.webkitMovementY || event.mozMovementY || 0*/;

            this._mouseDeltaX = mx;
            this._mouseDeltaY = my;

        } else {

            if ( this.enabled === false || !this.captureMouse ) return;

            const curMouseX = event.clientX;
            const curMouseY = event.clientY;

            this._mouseDeltaX = this._mouseX == -1 ? 0 : curMouseX - this._mouseX;
            this._mouseDeltaY = this._mouseY == -1 ? 0 : curMouseY - this._mouseY;
    
            this._mouseX = curMouseX;
            this._mouseY = curMouseY;

        }
        
        if ( this.states[this.KEYS.MOUSENX] ) this.states[ this.KEYS.MOUSENX ].on = this._mouseDeltaX < 0;
        if ( this.states[this.KEYS.MOUSEX] )  this.states[ this.KEYS.MOUSEX ].on  = this._mouseDeltaX > 0;
        if ( this.states[this.KEYS.MOUSENY] ) this.states[ this.KEYS.MOUSENY ].on = this._mouseDeltaY < 0;
        if ( this.states[this.KEYS.MOUSEY] )  this.states[ this.KEYS.MOUSEY ].on  = this._mouseDeltaY > 0;

    }
        
    protected mousedown ( _event: MouseEvent ): void {

        let event: any = _event;

        if ( event.event ) event = event.event;

        if ( event.button == 2 ) {

            this.captureMouse = !this.captureMouse;
            this._mouseX = -1;
            this._mouseY = -1;

            if ( this.captureMouse ) {

                if ( this.domElement.requestPointerLock ) {

                    this.domElement.requestPointerLock();

                }

            } else {

                if ( document.exitPointerLock ) {

                    document.exitPointerLock();

                }

            }
        }

    }
    
};

BehaviourManager.registerFactory(BasicControl.name, 
    (nbhv: any, gameData: any, objectid?: number, objecttype?: string) => new BasicControl(nbhv, gameData, objectid, objecttype)
);
