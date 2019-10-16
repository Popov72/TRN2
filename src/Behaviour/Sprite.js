TRN.Behaviours.Sprite = function(nbhv, gameData) {
    this.objMgr = gameData.objMgr;
    this.camera = gameData.camera;
}

TRN.Behaviours.Sprite.prototype = {

    constructor : TRN.Behaviours.Sprite,

    init : async function(lstObjs, resolve) {
        resolve(TRN.Consts.Behaviour.retKeepBehaviour);
    },

    frameEnded : function() {
        // make sure the object is always facing the camera
        const cameraRot = this.camera;

        const objects = Object.assign({}, this.objMgr.objectList['sprite'], this.objMgr.objectList['spriteseq']);

        for (let objID in objects) {
            const lstObj = objects[objID];

            for (let i = 0; i < lstObj.length; ++i) {
                const obj = lstObj[i];

                obj.quaternion.set(cameraRot.quaternion.x, cameraRot.quaternion.y, cameraRot.quaternion.z, cameraRot.quaternion.w);
                obj.updateMatrix();
            }
        }
    }

}
