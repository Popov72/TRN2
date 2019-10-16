export interface IMaterial {
 
    userData: any,
    uniforms: any,

    uniformsUpdated(names?: Array<string>): void;
    
}
