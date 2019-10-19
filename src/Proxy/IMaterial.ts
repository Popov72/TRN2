export interface IMaterial {
 
    userData: any,
    uniforms: any,

    depthWrite: boolean;
    
    vertexShader: string;
    fragmentShader: string;
    
    uniformsUpdated(names?: Array<string>): void;
    
    clone(): IMaterial;
    
}
