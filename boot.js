var Boot = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Boot ()
    {
        Phaser.Scene.call(this, 'Boot');
    },

    preload: function ()
    {
    },

    create: function ()
    {
        this.sound.pauseOnBlur = false;
        this.scene.start('Preloader');
    }
});
