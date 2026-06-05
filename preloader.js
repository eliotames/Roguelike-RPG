class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super('Preloader');
    }

    preload ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const title = this.add.text(width / 2, height / 2 - 60, 'Roguelike RPG', {
            fontFamily: 'Georgia, serif',
            fontSize: '36px',
            color: '#e6c84f'
        }).setOrigin(0.5);

        const barBg = this.add.rectangle(width / 2, height / 2, 320, 24, 0x333333).setOrigin(0.5);
        const barFill = this.add.rectangle(width / 2 - 156, height / 2, 0, 16, 0xe6c84f).setOrigin(0, 0.5);

        const loadingText = this.add.text(width / 2, height / 2 + 30, 'Loading...', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            barFill.width = 312 * value;
        });

        this.load.on('complete', () => {
            loadingText.setText('Complete!');
        });

        this.generateAssets();
    }

    generateAssets ()
    {
        // Player sprite (16x16 knight)
        const playerCanvas = this.textures.createCanvas('player', 16, 16);
        const pCtx = playerCanvas.getContext();
        // Body (armor)
        pCtx.fillStyle = '#4a6fa5';
        pCtx.fillRect(4, 4, 8, 10);
        // Head
        pCtx.fillStyle = '#e8c170';
        pCtx.fillRect(5, 1, 6, 5);
        // Helmet
        pCtx.fillStyle = '#7b7b7b';
        pCtx.fillRect(5, 0, 6, 3);
        // Eyes
        pCtx.fillStyle = '#222222';
        pCtx.fillRect(6, 3, 1, 1);
        pCtx.fillRect(9, 3, 1, 1);
        // Legs
        pCtx.fillStyle = '#5a3a1a';
        pCtx.fillRect(5, 13, 3, 3);
        pCtx.fillRect(9, 13, 3, 3);
        // Sword
        pCtx.fillStyle = '#c0c0c0';
        pCtx.fillRect(13, 3, 2, 8);
        pCtx.fillStyle = '#8B6914';
        pCtx.fillRect(12, 9, 4, 2);
        playerCanvas.refresh();

        // Floor tile
        const floorCanvas = this.textures.createCanvas('floor', 16, 16);
        const fCtx = floorCanvas.getContext();
        fCtx.fillStyle = '#3d3d3d';
        fCtx.fillRect(0, 0, 16, 16);
        fCtx.fillStyle = '#4a4a4a';
        fCtx.fillRect(1, 1, 14, 14);
        fCtx.fillStyle = '#424242';
        fCtx.fillRect(4, 4, 3, 3);
        fCtx.fillRect(10, 10, 3, 3);
        floorCanvas.refresh();

        // Wall tile
        const wallCanvas = this.textures.createCanvas('wall', 16, 16);
        const wCtx = wallCanvas.getContext();
        wCtx.fillStyle = '#5c4033';
        wCtx.fillRect(0, 0, 16, 16);
        wCtx.fillStyle = '#6b4f3a';
        wCtx.fillRect(1, 1, 6, 6);
        wCtx.fillRect(9, 1, 6, 6);
        wCtx.fillStyle = '#6b4f3a';
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

        // Enemy sprite (skeleton)
        const enemyCanvas = this.textures.createCanvas('enemy', 16, 16);
        const eCtx = enemyCanvas.getContext();
        // Body
        eCtx.fillStyle = '#d4d4d4';
        eCtx.fillRect(5, 5, 6, 7);
        // Ribs
        eCtx.fillStyle = '#aaaaaa';
        eCtx.fillRect(6, 6, 4, 1);
        eCtx.fillRect(6, 8, 4, 1);
        eCtx.fillRect(6, 10, 4, 1);
        // Skull
        eCtx.fillStyle = '#e8e8e8';
        eCtx.fillRect(5, 1, 6, 5);
        // Eyes
        eCtx.fillStyle = '#cc0000';
        eCtx.fillRect(6, 3, 2, 2);
        eCtx.fillRect(9, 3, 2, 2);
        // Legs
        eCtx.fillStyle = '#d4d4d4';
        eCtx.fillRect(5, 12, 2, 4);
        eCtx.fillRect(9, 12, 2, 4);
        enemyCanvas.refresh();

        // Potion
        const potionCanvas = this.textures.createCanvas('potion', 16, 16);
        const poCtx = potionCanvas.getContext();
        poCtx.fillStyle = '#cc3333';
        poCtx.fillRect(5, 6, 6, 8);
        poCtx.fillRect(4, 8, 8, 4);
        poCtx.fillStyle = '#886633';
        poCtx.fillRect(6, 4, 4, 3);
        poCtx.fillStyle = '#ff6666';
        poCtx.fillRect(6, 8, 2, 2);
        potionCanvas.refresh();

        // Gold coin
        const coinCanvas = this.textures.createCanvas('coin', 16, 16);
        const cCtx = coinCanvas.getContext();
        cCtx.fillStyle = '#daa520';
        cCtx.fillRect(4, 4, 8, 8);
        cCtx.fillRect(5, 3, 6, 10);
        cCtx.fillRect(3, 5, 10, 6);
        cCtx.fillStyle = '#ffd700';
        cCtx.fillRect(5, 5, 6, 6);
        cCtx.fillStyle = '#daa520';
        cCtx.fillRect(7, 5, 2, 6);
        coinCanvas.refresh();
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}
