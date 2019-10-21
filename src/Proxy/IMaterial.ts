export interface IMaterial {
 
    userData: any,
    uniforms: any,

    depthWrite: boolean;
    transparent: boolean;
    
    vertexShader: string;
    fragmentShader: string;
    
    uniformsUpdated(names?: Array<string>): void;
    
    clone(): IMaterial;
    
    setZBias(factor: number, unit: number): void;
}
