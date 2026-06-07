class MainMenu extends Phaser.Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        // Decorative line above title
        this.add.rectangle(cx, cy - 100, 360, 1, 0xc4a265);

        this.add.text(cx, cy - 60, 'CHRONICLES', {
            font: '52px monospace',
            color: CLR.heading,
        }).setOrigin(0.5);

        this.add.text(cx, cy - 4, 'of the Unnamed World', {
            font: '20px monospace',
            color: CLR.parchment,
        }).setOrigin(0.5);

        // Decorative line below subtitle
        this.add.rectangle(cx, cy + 30, 360, 1, 0xc4a265);

        // Pulsing start prompt
        const start = this.add.text(cx, cy + 100, 'Click anywhere to begin', {
            font: '16px monospace',
            color: CLR.dim,
        }).setOrigin(0.5);

        this.tweens.add({
            targets: start,
            alpha: 0.3,
            duration: 1200,
            yoyo: true,
            repeat: -1,
        });

        this.input.once('pointerdown', () =>
        {
            this.scene.start('CharacterCreation');
        });
    }
}