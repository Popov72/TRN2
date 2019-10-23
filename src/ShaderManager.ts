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

    constructor() {
        this._fpath = '/resources/shader/';
        this._fileCache = {};
        this._level = <any>null;
    }

    public getShader(ptype: shaderType, name: string): Promise<string> {
        return this._getFile(name + (ptype == shaderType.vertex ? '.vs' : '.fs'));
    }

    public getVertexShader(name: string): Promise<string> {
        return this.getShader(shaderType.vertex, name);
    }

    public getFragmentShader(name: string): Promise<string> {
        return this.getShader(shaderType.fragment, name);
    }

    public setTRLevel(level: RawLevel): void {
        this._level = level;
    }

    protected _getFile(fname: string) {
        if (typeof this._fileCache[fname] != 'undefined') {
            return this._fileCache[fname];
        }
        this._fileCache[fname] = this._loadFile(fname);
        return this._fileCache[fname];
    }

    protected _loadFile(fname: string): Promise<string> {
        return fetch(this._fpath + fname).then((response) => {
            return response.text().then((txt) => {
                txt = txt.replace(/##tr_version##/g, this._level.rversion.substr(2));
                return txt;
            });
        });
    }

}
