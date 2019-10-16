TRN.Behaviours.ParticleSystem = function(nbhv, gameData) {
    this.nbhv = nbhv;
}

TRN.Behaviours.ParticleSystem.prototype = {

    constructor : TRN.Behaviours.ParticleSystem,

    init : async function(lstObjs, resolve) {
        resolve(TRN.Consts.Behaviour.retKeepBehaviour);
    }

}
