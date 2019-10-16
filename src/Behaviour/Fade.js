TRN.Behaviours.Fade = function(nbhv, gameData) {
    this.nbhv = nbhv;
    this.sceneRender = gameData.sceneRender;
    this.bhvMgr = gameData.bhvMgr;
    this.gameData = gameData;
}

TRN.Behaviours.Fade.prototype = {

    constructor : TRN.Behaviours.Fade,

    init : async function(lstObjs, resolve) {
        this.lstObjs = lstObjs;

        this.colorStart = this.nbhv.colorStart;
        this.colorEnd = this.nbhv.colorEnd;
        this.duration = parseFloat(this.nbhv.duration);
        this.startTime = -1;
        
        this.setColor(this.colorStart);

        resolve(TRN.Consts.Behaviour.retKeepBehaviour);
    },

    frameStarted : function(curTime, delta) {
        if (this.startTime < 0) {
            this.startTime = curTime;
        }

        const ratio = (curTime - this.startTime) / this.duration;
              color = [
                this.colorStart[0] + (this.colorEnd[0] - this.colorStart[0]) * ratio,
                this.colorStart[1] + (this.colorEnd[1] - this.colorStart[1]) * ratio,
                this.colorStart[2] + (this.colorEnd[2] - this.colorStart[2]) * ratio
              ];

        this.setColor(color);

        if (curTime - this.startTime >= this.duration) {
            this.setColor(this.colorEnd);
            this.bhvMgr.removeBehaviour(this);
        }
    },

    setColor : function(color) {
		this.sceneRender.traverse( (obj) => {
            if (!obj.visible || !(obj instanceof THREE.Mesh)) {
                return;
            }

            const materials = obj.material;
            
			if (!materials || !materials.length) {
                return;
            }

			for (let i = 0; i < materials.length; ++i) {
				const material = materials[i];

				material.uniforms.tintColor.value = color;
			}
        });
    }

}
