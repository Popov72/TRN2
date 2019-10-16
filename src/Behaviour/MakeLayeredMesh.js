TRN.Behaviours.MakeLayeredMesh = function(nbhv, gameData) {
    this.nbhv = nbhv;
    this.gameData = gameData;
    this.sceneData = gameData.sceneData;
}

TRN.Behaviours.MakeLayeredMesh.prototype = {

    constructor : TRN.Behaviours.MakeLayeredMesh,

    init : async function(lstObjs, resolve) {

        if (lstObjs != null) {
            lstObjs.forEach( (obj) => {
                const data = this.sceneData.objects[obj.name],
                      layer = new TRN.Layer(obj, this.gameData);
  
                data.layer = layer;
        });
        }

        resolve(TRN.Consts.Behaviour.retDontKeepBehaviour);
    }

}
