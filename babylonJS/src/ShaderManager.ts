import {
    shaderType,
    ShaderManager as ShaderManagerBase
} from "../../src/ShaderManager";

import Shader from "./Shader";

export class ShaderManager extends ShaderManagerBase {

    protected _uniforms: Map<string, Set<string>>;

    constructor() {
        super();

        this._uniforms = new Map();
    }

    public getShader(ptype: shaderType, name: string): Promise<string> {
        return this._getFile2(name, ptype);
    }

    public getVertexShader(name: string): Promise<string> {
        return this.getShader(shaderType.vertex, name);
    }

    public getFragmentShader(name: string): Promise<string> {
        return this.getShader(shaderType.fragment, name);
    }

    public getUniforms(name: string): Set<string> | undefined {
        return this._uniforms.get(name);
    }

    public getVertexUniforms(name: string): Set<string> | undefined {
        return this.getUniforms(name + '.vs');
    }

    public getFragmentUniforms(name: string): Set<string> | undefined {
        return this.getUniforms(name + '.fs');
    }

    protected _getFile2(fname: string, ptype: string): Promise<string> {
        const promiseCode = this._loadFile(fname + (ptype == shaderType.vertex ? '.vs' : '.fs'));

        return promiseCode.then((code) => {
            if (code === "") {
                throw `Can't load shader "${fname}"!`;
            }

            const uniformsUsed = new Set<string>();

            this._uniforms.set(fname + (ptype == shaderType.vertex ? '.vs' : '.fs'), uniformsUsed);

            return Shader.getShader(ptype == 'vertex' ? 'Vertex' : 'Fragment', fname, code, uniformsUsed);
        });
    }

}
