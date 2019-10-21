import {
    Effect
} from "babylonjs";

/*
  Stolen from GLTF v1.0 loader
*/
enum ETokenType {
    IDENTIFIER = 1,

    UNKNOWN = 2,
    END_OF_INPUT = 3
}

class Tokenizer {
    private _toParse: string;
    private _pos: number = 0;
    private _maxPos: number;

    public currentToken: ETokenType = ETokenType.UNKNOWN;
    public currentIdentifier: string = "";
    public currentString: string = "";
    public isLetterOrDigitPattern: RegExp = /^[a-zA-Z0-9]+$/;

    constructor(toParse: string) {
        this._toParse = toParse;
        this._maxPos = toParse.length;
    }

    public getNextToken(): ETokenType {
        if (this.isEnd()) { return ETokenType.END_OF_INPUT; }

        this.currentString = this.read();
        this.currentToken = ETokenType.UNKNOWN;

        if (this.currentString === "_" || this.isLetterOrDigitPattern.test(this.currentString)) {
            this.currentToken = ETokenType.IDENTIFIER;
            this.currentIdentifier = this.currentString;
            while (!this.isEnd() && (this.isLetterOrDigitPattern.test(this.currentString = this.peek()) || this.currentString === "_")) {
                this.currentIdentifier += this.currentString;
                this.forward();
            }
        }

        return this.currentToken;
    }

    public peek(): string {
        return this._toParse[this._pos];
    }

    public read(): string {
        return this._toParse[this._pos++];
    }

    public forward(): void {
        this._pos++;
    }

    public isEnd(): boolean {
        return this._pos >= this._maxPos;
    }
}

const tokenSource = ["modelMatrix", "modelViewMatrix",  "projectionMatrix", "viewMatrix",   "normalMatrix", "cameraPosition"],
      tokenDest =   ["world",       "worldView",        "projection",       "view",         null,           null];

export default class Shader {

    private static shaderMap: Map<string, string> = new Map();

    public static getShader(shaderType: string, name: string, code: string, uniformsUsed: Set<string>): string {
        code = Shader.parseShader(code, uniformsUsed);
        
        let ssname = this.shaderMap.get(code);

        if (ssname === undefined) {
            ssname = `${name}`;
            this.shaderMap.set(code, ssname);
            Effect.ShadersStore[`${ssname}${shaderType}Shader`] = code;
        }

        return ssname;
    }

    protected static parseShader(code: string, uniformsUsed: Set<string>): string {
        let tokenizer = new Tokenizer(code),
            newcode = "";

        while (!tokenizer.isEnd() && tokenizer.getNextToken()) {
            let tokenType = tokenizer.currentToken;

            if (tokenType !== ETokenType.IDENTIFIER) {
                newcode += tokenizer.currentString;
                continue;
            }

            const [token, remapped] = Shader.parseShaderTokens(tokenizer);
            if (token == null) {
                console.log(code);
                throw `Can't parse shader because the token "${tokenizer.currentIdentifier}" is used in the original shader and can't be mapped!`;
            }

            if (remapped) {
                uniformsUsed.add(token);
            }

            newcode += token;
        }

        return newcode;
    }

    protected static parseShaderTokens(tokenizer: Tokenizer): [string | null, boolean] {
        for (let i = 0; i < tokenSource.length; ++i) {
            const tokenSrc = tokenSource[i];
    
            if (tokenizer.currentIdentifier === tokenSrc) {
                return [tokenDest[i], true];
            }
        }
    
        return [tokenizer.currentIdentifier, false];
    };

}
