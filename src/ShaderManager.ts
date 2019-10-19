export enum shaderType {
    vertex = "vertex",
    fragment = "fragment",
}

interface FileCache {
    [name: string] : string,
}

export class ShaderManager {

    protected _fpath: string;
    protected _fileCache: FileCache;

    constructor() {
	    this._fpath = '/resources/shader/';
        this._fileCache = {};
    }

	public getShader(ptype: shaderType, name: string): string {
		return this._getFile(name + (ptype == shaderType.vertex ? '.vs' : '.fs'));
	}

	public getVertexShader(name: string) {
		return this.getShader(shaderType.vertex, name);
	}

	public getFragmentShader(name: string) {
		return this.getShader(shaderType.fragment, name);
	}

	protected _getFile(fname: string) {
		if (typeof this._fileCache[fname] != 'undefined') {
            return this._fileCache[fname];
        }
		this._fileCache[fname] = this._loadFile(fname);
		return this._fileCache[fname];
	}

	protected _loadFile(fname: string) {
		let res: string = "";
		jQuery.ajax({
			type:       "GET",
			url:        this._fpath + fname,
			dataType:   "text",
			cache:      false,
			async:      false
		}).done( (data) => res = data );
		return res;
	}

}
