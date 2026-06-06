var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Preloader ()
    {
        Phaser.Scene.call(this, 'Preloader');
    },

    preload: function ()
    {
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        this.add.text(width / 2, height / 2 - 60, 'Roguelike RPG', {
            fontFamily: 'Georgia, serif',
            fontSize: '36px',
            color: '#e6c84f'
        }).setOrigin(0.5);

        var barBg = this.add.rectangle(width / 2, height / 2, 320, 24, 0x333333).setOrigin(0.5);
        var barFill = this.add.rectangle(width / 2 - 156, height / 2, 0, 16, 0xe6c84f).setOrigin(0, 0.5);

        var loadingText = this.add.text(width / 2, height / 2 + 30, 'Loading...', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        this.load.on('progress', function (value) {
            barFill.width = 312 * value;
        });

        this.load.on('complete', function () {
            loadingText.setText('Complete!');
        });

        this.generateAssets();
    },

    generateAssets: function ()
    {
        var playerCanvas = this.textures.createCanvas('player', 16, 16);
        var pCtx = playerCanvas.getContext();
        pCtx.fillStyle = '#4a6fa5';
        pCtx.fillRect(4, 4, 8, 10);
        pCtx.fillStyle = '#e8c170';
        pCtx.fillRect(5, 1, 6, 5);
        pCtx.fillStyle = '#7b7b7b';
        pCtx.fillRect(5, 0, 6, 3);
        pCtx.fillStyle = '#222222';
        pCtx.fillRect(6, 3, 1, 1);
        pCtx.fillRect(9, 3, 1, 1);
        pCtx.fillStyle = '#5a3a1a';
        pCtx.fillRect(5, 13, 3, 3);
        pCtx.fillRect(9, 13, 3, 3);
        pCtx.fillStyle = '#c0c0c0';
        pCtx.fillRect(13, 3, 2, 8);
        pCtx.fillStyle = '#8B6914';
        pCtx.fillRect(12, 9, 4, 2);
        playerCanvas.refresh();

        var floorCanvas = this.textures.createCanvas('floor', 16, 16);
        var fCtx = floorCanvas.getContext();
        fCtx.fillStyle = '#3d3d3d';
        fCtx.fillRect(0, 0, 16, 16);
        fCtx.fillStyle = '#4a4a4a';
        fCtx.fillRect(1, 1, 14, 14);
        fCtx.fillStyle = '#424242';
        fCtx.fillRect(4, 4, 3, 3);
        fCtx.fillRect(10, 10, 3, 3);
        floorCanvas.refresh();

        var wallCanvas = this.textures.createCanvas('wall', 16, 16);
        var wCtx = wallCanvas.getContext();
        wCtx.fillStyle = '#5c4033';
        wCtx.fillRect(0, 0, 16, 16);
        wCtx.fillStyle = '#6b4f3a';
        wCtx.fillRect(1, 1, 6, 6);
        wCtx.fillRect(9, 1, 6, 6);
        wCtx.fillRect(0, 9, 4, 6);
        wCtx.fillRect(5, 9, 6, 6);
        wCtx.fillRect(12, 9, 4, 6);
        wCtx.fillStyle = '#4a3328';
        wCtx.fillRect(0, 0, 16, 1);
        wCtx.fillRect(0, 8, 16, 1);
        wCtx.fillRect(7, 0, 1, 8);
        wCtx.fillRect(4, 8, 1, 8);
        wCtx.fillRect(11, 8, 1, 8);
        wallCanvas.refresh();

        var enemyCanvas = this.textures.createCanvas('enemy', 16, 16);
        var eCtx = enemyCanvas.getContext();
        eCtx.fillStyle = '#d4d4d4';
        eCtx.fillRect(5, 5, 6, 7);
        eCtx.fillStyle = '#aaaaaa';
        eCtx.fillRect(6, 6, 4, 1);
        eCtx.fillRect(6, 8, 4, 1);
        eCtx.fillRect(6, 10, 4, 1);
        eCtx.fillStyle = '#e8e8e8';
        eCtx.fillRect(5, 1, 6, 5);
        eCtx.fillStyle = '#cc0000';
        eCtx.fillRect(6, 3, 2, 2);
        eCtx.fillRect(9, 3, 2, 2);
        eCtx.fillStyle = '#d4d4d4';
        eCtx.fillRect(5, 12, 2, 4);
        eCtx.fillRect(9, 12, 2, 4);
        enemyCanvas.refresh();

        var potionCanvas = this.textures.createCanvas('potion', 16, 16);
        var poCtx = potionCanvas.getContext();
        poCtx.fillStyle = '#cc3333';
        poCtx.fillRect(5, 6, 6, 8);
        poCtx.fillRect(4, 8, 8, 4);
        poCtx.fillStyle = '#886633';
        poCtx.fillRect(6, 4, 4, 3);
        poCtx.fillStyle = '#ff6666';
        poCtx.fillRect(6, 8, 2, 2);
        potionCanvas.refresh();

        var coinCanvas = this.textures.createCanvas('coin', 16, 16);
        var cCtx = coinCanvas.getContext();
        cCtx.fillStyle = '#daa520';
        cCtx.fillRect(4, 4, 8, 8);
        cCtx.fillRect(5, 3, 6, 10);
        cCtx.fillRect(3, 5, 10, 6);
        cCtx.fillStyle = '#ffd700';
        cCtx.fillRect(5, 5, 6, 6);
        cCtx.fillStyle = '#daa520';
        cCtx.fillRect(7, 5, 2, 6);
        coinCanvas.refresh();
    },

    create: function ()
    {
        this.scene.start('MainMenu');
    }
});
