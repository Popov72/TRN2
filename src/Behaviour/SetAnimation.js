TRN.Behaviours.SetAnimation = function(nbhv, gameData) {
    this.nbhv = nbhv;
    this.sceneData = gameData.sceneData;
    this.anmMgr = gameData.anmMgr;
}

TRN.Behaviours.SetAnimation.prototype = {

    constructor : TRN.Behaviours.Flare,

    init : async function(lstObjs, resolve) {
        const anim = parseInt(this.nbhv.anim);

        if (lstObjs !== null && lstObjs.length) {
            lstObjs.forEach( (obj) => this.anmMgr.setAnimation(obj, anim, false) );
        }

        resolve(TRN.Consts.Behaviour.retDontKeepBehaviour);
    }

}
