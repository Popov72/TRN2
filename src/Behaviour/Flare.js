TRN.Behaviours.Flare = function(nbhv, gameData) {
    this.nbhv = nbhv;
}

TRN.Behaviours.Flare.prototype = {

    constructor : TRN.Behaviours.Flare,

    init : async function(lstObjs, resolve) {
        resolve(TRN.Consts.Behaviour.retKeepBehaviour);
    }

}
