TRN.Behaviours.Zbias = function(nbhv, gameData) {
    this.nbhv = nbhv;
}

TRN.Behaviours.Zbias.prototype = {

    constructor : TRN.Behaviours.Zbias,

    init : async function(lstObjs, resolve) {
        const params = this.nbhv.polygoneoffset;
        if (params) {
            const factor = params.factor, unit = params.unit;
            lstObjs.forEach( (obj) => {
                const materials = obj.material;
                for (let m = 0; m < materials.length; ++m) {
                    const material = materials[m];
                    material.polygonOffset = true;
                    material.polygonOffsetFactor = factor;
                    material.polygonOffsetUnits = unit;
                }
            });
        }

        resolve(TRN.Consts.Behaviour.retDontKeepBehaviour);
    }

}
