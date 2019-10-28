import { RawLevel } from "./Loading/LevelLoader";

export enum shaderType {
    vertex = "vertex",
    fragment = "fragment",
}

interface FileCache {
    [name: string] : Promise<string>;
}

export class ShaderManager {

    protected _fpath: string;
    protected _fileCache: FileCache;
    protected _level: RawLevel;
    protected _globalLightsInFragment: boolean;

    constructor() {
        this._fpath = '/resources/shader/';
        this._fileCache = {};
        this._level = <any>null;
        this._globalLightsInFragment = true;
    }

    public get globalLightsInFragment(): boolean {
        return this._globalLightsInFragment;
    }

    public set globalLightsInFragment(glif: boolean) {
        this._globalLightsInFragment = glif;
    }

    public getShader(ptype: shaderType, name: string, forceReload: boolean = false): Promise<string> {
        return this._getFile(name + (ptype == shaderType.vertex ? '.vs' : '.fs'), forceReload);
    }

    public getVertexShader(name: string, forceReload: boolean = false): Promise<string> {
        return this.getShader(shaderType.vertex, name, forceReload);
    }

    public getFragmentShader(name: string, forceReload: boolean = false): Promise<string> {
        return this.getShader(shaderType.fragment, name, forceReload);
    }

    public setTRLevel(level: RawLevel): void {
        this._level = level;
    }

    protected preprocess(code: string): string {
        return code
            .replace(/##tr_version##/g, this._level.rversion.substr(2))
            .replace(/##global_lights_in_vertex##/g, this._globalLightsInFragment ? "0" : "1")
            .replace(/##global_lights_in_fragment##/g, this._globalLightsInFragment ? "1" : "0");
    }

    protected _getFile(fname: string, forceReload: boolean = false) {
        if (!forceReload && typeof this._fileCache[fname] != 'undefined') {
            return this._fileCache[fname];
        }
        this._fileCache[fname] = this._loadFile(fname);
        return this._fileCache[fname];
    }

    protected _loadFile(fname: string): Promise<string> {
        return fetch(this._fpath + fname).then((response) => {
            return response.text().then((txt) => {
                return this.preprocess(txt);
            });
        });
    }

}
