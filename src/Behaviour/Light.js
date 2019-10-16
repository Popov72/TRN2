TRN.Behaviours.Light = function(nbhv, gameData) {
    this.nbhv = nbhv;
}

TRN.Behaviours.Light.prototype = {

    constructor : TRN.Behaviours.Light,

    init : async function(lstObjs, resolve) {
        resolve(TRN.Consts.Behaviour.retKeepBehaviour);
    }

}
