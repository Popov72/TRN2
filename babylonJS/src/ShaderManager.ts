import { 
    shaderType,
    ShaderManager as ShaderManagerBase 
} from "../../src/ShaderManager";

import Shader from "./Shader";

export class ShaderManager extends ShaderManagerBase {

    constructor() {
        super();
    }

	public getShader(ptype: shaderType, name: string) {
		return this._getFile2(name, ptype);
	}

	public getVertexShader(name: string) {
		return this.getShader(shaderType.vertex, name);
	}

	public getFragmentShader(name: string) {
		return this.getShader(shaderType.fragment, name);
	}

	protected _getFile2(fname: string, ptype: string): string {
        const code = this._loadFile(fname + (ptype == shaderType.vertex ? '.vs' : '.fs')),
              uniformsUsed = new Set<string>();

        return Shader.getShader(ptype == 'vertex' ? 'Vertex' : 'Fragment', fname, code, uniformsUsed);
	}

}
