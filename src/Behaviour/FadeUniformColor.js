TRN.Behaviours.FadeUniformColor = function(nbhv, gameData) {
    TRN.Behaviours.Fade.call(this, nbhv, gameData);
}

TRN.Behaviours.FadeUniformColor.prototype = Object.assign( Object.create(TRN.Behaviours.Fade.prototype), {

    constructor : TRN.Behaviours.FadeUniformColor,

    init: async function(lstObjs, resolve) {
        if (this.nbhv.uniforms === null) {
            resolve(TRN.Consts.Behaviour.retDontKeepBehaviour);
        }

        this.uniforms = this.nbhv.uniforms;

        TRN.Behaviours.Fade.prototype.init.call(this, lstObjs, resolve);
    },

    setColor : function(color) {
        for (let i = 0; i < this.uniforms.length; ++i) {
            const u = this.uniforms[i];
            u.a[u.i + 0] = color[0];
            u.a[u.i + 1] = color[1];
            u.a[u.i + 2] = color[2];
        }
    }

});
