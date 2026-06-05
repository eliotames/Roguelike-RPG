class Game extends Phaser.Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.mapWidth = 50;
        this.mapHeight = 38;
        this.tileSize = 16;

        this.map = this.generateMap();
        this.renderMap();

        const spawn = this.findOpenTile();
        this.player = this.physics.add.sprite(
            spawn.x * this.tileSize + this.tileSize / 2,
            spawn.y * this.tileSize + this.tileSize / 2,
            'player'
        );
        this.player.setCollideWorldBounds(true);
        this.player.setDepth(10);
        this.player.hp = 100;
        this.player.maxHp = 100;
        this.player.attack = 15;
        this.player.gold = 0;
        this.player.potions = 0;

        this.physics.world.setBounds(0, 0, this.mapWidth * this.tileSize, this.mapHeight * this.tileSize);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, this.mapWidth * this.tileSize, this.mapHeight * this.tileSize);
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.walls = this.physics.add.staticGroup();
        for (let y = 0; y < this.mapHeight; y++)
        {
            for (let x = 0; x < this.mapWidth; x++)
            {
                if (this.map[y][x] === 1)
                {
                    this.walls.create(
                        x * this.tileSize + this.tileSize / 2,
                        y * this.tileSize + this.tileSize / 2,
                        'wall'
                    ).setVisible(false).refreshBody();
                }
            }
        }
        this.physics.add.collider(this.player, this.walls);

        this.enemies = this.physics.add.group();
        this.spawnEnemies(8);
        this.physics.add.collider(this.enemies, this.walls);
        this.physics.add.collider(this.enemies, this.enemies);

        this.potions = this.physics.add.group();
        this.coins = this.physics.add.group();
        this.spawnItems();

        this.physics.add.overlap(this.player, this.potions, this.collectPotion, null, this);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        this.createHUD();

        this.playerSpeed = 100;
        this.attackCooldown = false;

        this.input.on('pointerdown', () => this.playerAttack());
        this.input.keyboard.on('keydown-SPACE', () => this.playerAttack());
        this.input.keyboard.on('keydown-E', () => this.usePotion());
    }

    generateMap ()
    {
        const map = Array.from({ length: this.mapHeight }, () =>
            Array(this.mapWidth).fill(1)
        );

        const rooms = [];
        const maxRooms = 12;

        for (let i = 0; i < maxRooms; i++)
        {
            const w = Phaser.Math.Between(4, 10);
            const h = Phaser.Math.Between(4, 8);
            const x = Phaser.Math.Between(1, this.mapWidth - w - 1);
            const y = Phaser.Math.Between(1, this.mapHeight - h - 1);

            let overlaps = false;
            for (const room of rooms)
            {
                if (x <= room.x + room.w + 1 && x + w >= room.x - 1 &&
                    y <= room.y + room.h + 1 && y + h >= room.y - 1)
                {
                    overlaps = true;
                    break;
                }
            }
            if (overlaps) continue;

            for (let ry = y; ry < y + h; ry++)
            {
                for (let rx = x; rx < x + w; rx++)
                {
                    map[ry][rx] = 0;
                }
            }

            if (rooms.length > 0)
            {
                const prev = rooms[rooms.length - 1];
                const prevCX = Math.floor(prev.x + prev.w / 2);
                const prevCY = Math.floor(prev.y + prev.h / 2);
                const currCX = Math.floor(x + w / 2);
                const currCY = Math.floor(y + h / 2);

                if (Math.random() > 0.5)
                {
                    this.carveHCorridor(map, prevCX, currCX, prevCY);
                    this.carveVCorridor(map, prevCY, currCY, currCX);
                }
                else
                {
                    this.carveVCorridor(map, prevCY, currCY, prevCX);
                    this.carveHCorridor(map, prevCX, currCX, currCY);
                }
            }

            rooms.push({ x, y, w, h });
        }

        this.rooms = rooms;
        return map;
    }

    carveHCorridor (map, x1, x2, y)
    {
        const start = Math.min(x1, x2);
        const end = Math.max(x1, x2);
        for (let x = start; x <= end; x++)
        {
            if (y > 0 && y < this.mapHeight - 1) map[y][x] = 0;
        }
    }

    carveVCorridor (map, y1, y2, x)
    {
        const start = Math.min(y1, y2);
        const end = Math.max(y1, y2);
        for (let y = start; y <= end; y++)
        {
            if (x > 0 && x < this.mapWidth - 1) map[y][x] = 0;
        }
    }

    renderMap ()
    {
        this.mapLayer = this.add.group();
        for (let y = 0; y < this.mapHeight; y++)
        {
            for (let x = 0; x < this.mapWidth; x++)
            {
                const px = x * this.tileSize + this.tileSize / 2;
                const py = y * this.tileSize + this.tileSize / 2;
                if (this.map[y][x] === 0)
                {
                    this.add.image(px, py, 'floor');
                }
                else
                {
                    this.add.image(px, py, 'wall');
                }
            }
        }
    }

    findOpenTile ()
    {
        if (this.rooms && this.rooms.length > 0)
        {
            const room = this.rooms[0];
            return {
                x: Math.floor(room.x + room.w / 2),
                y: Math.floor(room.y + room.h / 2)
            };
        }
        while (true)
        {
            const x = Phaser.Math.Between(1, this.mapWidth - 2);
            const y = Phaser.Math.Between(1, this.mapHeight - 2);
            if (this.map[y][x] === 0) return { x, y };
        }
    }

    findOpenTileInRoom (roomIndex)
    {
        const room = this.rooms[roomIndex];
        let attempts = 0;
        while (attempts < 50)
        {
            const x = Phaser.Math.Between(room.x, room.x + room.w - 1);
            const y = Phaser.Math.Between(room.y, room.y + room.h - 1);
            if (this.map[y][x] === 0) return { x, y };
            attempts++;
        }
        return null;
    }

    spawnEnemies (count)
    {
        for (let i = 0; i < count && i + 1 < this.rooms.length; i++)
        {
            const pos = this.findOpenTileInRoom(i + 1);
            if (!pos) continue;

            const enemy = this.enemies.create(
                pos.x * this.tileSize + this.tileSize / 2,
                pos.y * this.tileSize + this.tileSize / 2,
                'enemy'
            );
            enemy.setCollideWorldBounds(true);
            enemy.hp = 40;
            enemy.maxHp = 40;
            enemy.attack = 8;
            enemy.speed = 40;
            enemy.aggroRange = 80;
            enemy.setImmovable(false);
            enemy.setBounce(0);
            enemy.body.setSize(12, 12);

            enemy.patrolTarget = this.getRandomPatrolPoint(this.rooms[i + 1]);
            enemy.homeRoom = i + 1;
        }
    }

    getRandomPatrolPoint (room)
    {
        return {
            x: Phaser.Math.Between(room.x + 1, room.x + room.w - 2) * this.tileSize + this.tileSize / 2,
            y: Phaser.Math.Between(room.y + 1, room.y + room.h - 2) * this.tileSize + this.tileSize / 2
        };
    }

    spawnItems ()
    {
        for (let i = 1; i < this.rooms.length; i++)
        {
            if (Math.random() < 0.5)
            {
                const pos = this.findOpenTileInRoom(i);
                if (pos)
                {
                    this.potions.create(
                        pos.x * this.tileSize + this.tileSize / 2,
                        pos.y * this.tileSize + this.tileSize / 2,
                        'potion'
                    ).setDepth(5);
                }
            }
            const coinCount = Phaser.Math.Between(0, 3);
            for (let c = 0; c < coinCount; c++)
            {
                const pos = this.findOpenTileInRoom(i);
                if (pos)
                {
                    this.coins.create(
                        pos.x * this.tileSize + this.tileSize / 2,
                        pos.y * this.tileSize + this.tileSize / 2,
                        'coin'
                    ).setDepth(5);
                }
            }
        }
    }

    collectPotion (player, potion)
    {
        potion.destroy();
        this.player.potions++;
        this.showFloatingText(player.x, player.y - 12, '+1 Potion', '#ff6666');
        this.updateHUD();
    }

    collectCoin (player, coin)
    {
        coin.destroy();
        this.player.gold += 10;
        this.showFloatingText(player.x, player.y - 12, '+10 Gold', '#ffd700');
        this.updateHUD();
    }

    usePotion ()
    {
        if (this.player.potions > 0 && this.player.hp < this.player.maxHp)
        {
            this.player.potions--;
            this.player.hp = Math.min(this.player.hp + 30, this.player.maxHp);
            this.showFloatingText(this.player.x, this.player.y - 12, '+30 HP', '#66ff66');
            this.updateHUD();
        }
    }

    playerAttack ()
    {
        if (this.attackCooldown) return;
        this.attackCooldown = true;

        const attackRange = 28;
        this.enemies.getChildren().forEach((enemy) => {
            const dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, enemy.x, enemy.y
            );
            if (dist <= attackRange)
            {
                const damage = this.player.attack + Phaser.Math.Between(-3, 3);
                enemy.hp -= damage;
                this.showFloatingText(enemy.x, enemy.y - 12, `-${damage}`, '#ffaa00');

                const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
                enemy.body.setVelocity(Math.cos(angle) * 120, Math.sin(angle) * 120);
                this.time.delayedCall(150, () => {
                    if (enemy.active) enemy.body.setVelocity(0, 0);
                });

                if (enemy.hp <= 0) this.defeatEnemy(enemy);
            }
        });

        this.player.setTint(0xffaa00);
        this.time.delayedCall(100, () => this.player.clearTint());
        this.time.delayedCall(400, () => { this.attackCooldown = false; });
    }

    defeatEnemy (enemy)
    {
        this.showFloatingText(enemy.x, enemy.y - 12, 'Defeated!', '#ff4444');
        const goldDrop = Phaser.Math.Between(5, 20);
        this.player.gold += goldDrop;
        this.showFloatingText(enemy.x, enemy.y, `+${goldDrop} Gold`, '#ffd700');
        enemy.destroy();
        this.updateHUD();

        if (this.enemies.countActive() === 0)
        {
            this.showFloatingText(this.player.x, this.player.y - 24, 'Dungeon Cleared!', '#66ff66');
        }
    }

    showFloatingText (x, y, text, color)
    {
        const floatText = this.add.text(x, y, text, {
            fontFamily: 'monospace',
            fontSize: '10px',
            color: color,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: floatText,
            y: y - 20,
            alpha: 0,
            duration: 800,
            onComplete: () => floatText.destroy()
        });
    }

    createHUD ()
    {
        this.hud = this.add.group();

        const padding = 10;
        const barWidth = 120;
        const barHeight = 12;

        this.hpBarBg = this.add.rectangle(padding, padding, barWidth, barHeight, 0x333333)
            .setOrigin(0, 0).setScrollFactor(0).setDepth(200);
        this.hpBarFill = this.add.rectangle(padding, padding, barWidth, barHeight, 0xcc3333)
            .setOrigin(0, 0).setScrollFactor(0).setDepth(201);
        this.hpText = this.add.text(padding + barWidth / 2, padding + barHeight / 2, '100/100', {
            fontFamily: 'monospace',
            fontSize: '9px',
            color: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(202);

        this.goldText = this.add.text(padding, padding + barHeight + 8, 'Gold: 0', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#ffd700'
        }).setScrollFactor(0).setDepth(200);

        this.potionText = this.add.text(padding, padding + barHeight + 24, 'Potions: 0  [E] use', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#ff6666'
        }).setScrollFactor(0).setDepth(200);

        this.enemyText = this.add.text(padding, padding + barHeight + 40, 'Enemies: 0', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#aaaaaa'
        }).setScrollFactor(0).setDepth(200);
    }

    updateHUD ()
    {
        const hpRatio = Math.max(0, this.player.hp / this.player.maxHp);
        this.hpBarFill.width = 120 * hpRatio;
        this.hpText.setText(`${Math.max(0, this.player.hp)}/${this.player.maxHp}`);

        if (hpRatio > 0.5) this.hpBarFill.setFillStyle(0xcc3333);
        else if (hpRatio > 0.25) this.hpBarFill.setFillStyle(0xcc7733);
        else this.hpBarFill.setFillStyle(0xcc0000);

        this.goldText.setText(`Gold: ${this.player.gold}`);
        this.potionText.setText(`Potions: ${this.player.potions}  [E] use`);
        this.enemyText.setText(`Enemies: ${this.enemies.countActive()}`);
    }

    update ()
    {
        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -1;
        else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = 1;

        if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -1;
        else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = 1;

        if (vx !== 0 && vy !== 0)
        {
            vx *= 0.707;
            vy *= 0.707;
        }

        this.player.setVelocity(vx * this.playerSpeed, vy * this.playerSpeed);

        // Enemy AI
        this.enemies.getChildren().forEach((enemy) => {
            if (!enemy.active) return;

            const dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, enemy.x, enemy.y
            );

            if (dist < enemy.aggroRange)
            {
                // Chase player
                const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                enemy.body.setVelocity(
                    Math.cos(angle) * enemy.speed * 1.2,
                    Math.sin(angle) * enemy.speed * 1.2
                );

                // Contact damage
                if (dist < 12 && !enemy.attackCooldown)
                {
                    this.player.hp -= enemy.attack;
                    this.showFloatingText(this.player.x, this.player.y - 12, `-${enemy.attack}`, '#ff4444');
                    this.player.setTint(0xff0000);
                    this.time.delayedCall(150, () => this.player.clearTint());
                    this.updateHUD();
                    enemy.attackCooldown = true;
                    this.time.delayedCall(1000, () => { enemy.attackCooldown = false; });

                    if (this.player.hp <= 0) this.gameOver();
                }
            }
            else
            {
                // Patrol
                if (enemy.patrolTarget)
                {
                    const patrolDist = Phaser.Math.Distance.Between(
                        enemy.x, enemy.y, enemy.patrolTarget.x, enemy.patrolTarget.y
                    );
                    if (patrolDist < 4)
                    {
                        enemy.patrolTarget = this.getRandomPatrolPoint(this.rooms[enemy.homeRoom]);
                    }
                    const angle = Phaser.Math.Angle.Between(
                        enemy.x, enemy.y, enemy.patrolTarget.x, enemy.patrolTarget.y
                    );
                    enemy.body.setVelocity(
                        Math.cos(angle) * enemy.speed * 0.5,
                        Math.sin(angle) * enemy.speed * 0.5
                    );
                }
            }
        });

        this.updateHUD();
    }

    gameOver ()
    {
        this.physics.pause();
        this.player.setTint(0xff0000);

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
            .setScrollFactor(0).setDepth(300);

        this.add.text(width / 2, height / 2 - 30, 'Game Over', {
            fontFamily: 'Georgia, serif',
            fontSize: '48px',
            color: '#cc3333',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301);

        this.add.text(width / 2, height / 2 + 20, `Gold collected: ${this.player.gold}`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffd700'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301);

        const restartText = this.add.text(width / 2, height / 2 + 60, 'Click or press SPACE to restart', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301);

        this.tweens.add({
            targets: restartText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.input.once('pointerdown', () => this.scene.restart());
        this.input.keyboard.once('keydown-SPACE', () => this.scene.restart());
    }
}
