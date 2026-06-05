class MainMenu extends Phaser.Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Tiled background
        for (let x = 0; x < width; x += 32)
        {
            for (let y = 0; y < height; y += 32)
            {
                const tile = (Math.random() > 0.3) ? 'floor' : 'wall';
                this.add.image(x + 16, y + 16, tile).setScale(2).setAlpha(0.3);
            }
        }

        // Darkened overlay
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);

        // Title
        const title = this.add.text(width / 2, height / 3, 'Roguelike RPG', {
            fontFamily: 'Georgia, serif',
            fontSize: '52px',
            color: '#e6c84f',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            y: title.y - 8,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtitle
        this.add.text(width / 2, height / 3 + 50, 'A Fantasy Adventure', {
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // Play button
        const playBtn = this.add.rectangle(width / 2, height / 2 + 60, 200, 50, 0x4a6fa5)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        const playText = this.add.text(width / 2, height / 2 + 60, 'Play', {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        playBtn.on('pointerover', () => {
            playBtn.setFillStyle(0x5a8fbf);
            playText.setColor('#e6c84f');
        });

        playBtn.on('pointerout', () => {
            playBtn.setFillStyle(0x4a6fa5);
            playText.setColor('#ffffff');
        });

        playBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Game');
            });
        });

        // Instructions
        this.add.text(width / 2, height - 60, 'WASD or Arrow Keys to move\nClick to attack', {
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#666666',
            align: 'center'
        }).setOrigin(0.5);

        // Keyboard shortcut to start
        this.input.keyboard.once('keydown-SPACE', () => {
            playBtn.emit('pointerdown');
        });
        this.input.keyboard.once('keydown-ENTER', () => {
            playBtn.emit('pointerdown');
        });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
