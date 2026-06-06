// ---- Boot Scene ----
class Boot extends Phaser.Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
    }

    create ()
    {
        this.sound.pauseOnBlur = false;
        this.scene.start('Preloader');
    }
}

// ---- Preloader Scene ----
class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super('Preloader');
    }

    preload ()
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
    }

    generateAssets ()
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
    }

    create ()
    {
        this.scene.start('MainMenu');
    }
}

// ---- MainMenu Scene ----
class MainMenu extends Phaser.Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        var self = this;
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        for (var x = 0; x < width; x += 32)
        {
            for (var y = 0; y < height; y += 32)
            {
                var tile = (Math.random() > 0.3) ? 'floor' : 'wall';
                this.add.image(x + 16, y + 16, tile).setScale(2).setAlpha(0.3);
            }
        }

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5);

        var title = this.add.text(width / 2, height / 3, 'Roguelike RPG', {
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

        this.add.text(width / 2, height / 3 + 50, 'A Fantasy Adventure', {
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        var playBtn = this.add.rectangle(width / 2, height / 2 + 60, 200, 50, 0x4a6fa5)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        var playText = this.add.text(width / 2, height / 2 + 60, 'Play', {
            fontFamily: 'Georgia, serif',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        playBtn.on('pointerover', function () {
            playBtn.setFillStyle(0x5a8fbf);
            playText.setColor('#e6c84f');
        });

        playBtn.on('pointerout', function () {
            playBtn.setFillStyle(0x4a6fa5);
            playText.setColor('#ffffff');
        });

        playBtn.on('pointerdown', function () {
            self.cameras.main.fadeOut(500, 0, 0, 0);
            self.cameras.main.once('camerafadeoutcomplete', function () {
                self.scene.start('Game');
            });
        });

        this.add.text(width / 2, height - 60, 'WASD or Arrow Keys to move\nClick or SPACE to attack\nE to use potion', {
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#666666',
            align: 'center'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', function () {
            playBtn.emit('pointerdown');
        });
        this.input.keyboard.once('keydown-ENTER', function () {
            playBtn.emit('pointerdown');
        });

        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}

// ---- Game Scene ----
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

        var spawn = this.findOpenTile();
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
        for (var wy = 0; wy < this.mapHeight; wy++)
        {
            for (var wx = 0; wx < this.mapWidth; wx++)
            {
                if (this.map[wy][wx] === 1)
                {
                    this.walls.create(
                        wx * this.tileSize + this.tileSize / 2,
                        wy * this.tileSize + this.tileSize / 2,
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

        var self = this;
        this.input.on('pointerdown', function () { self.playerAttack(); });
        this.input.keyboard.on('keydown-SPACE', function () { self.playerAttack(); });
        this.input.keyboard.on('keydown-E', function () { self.usePotion(); });
    }

    generateMap ()
    {
        var map = [];
        for (var my = 0; my < this.mapHeight; my++)
        {
            var row = [];
            for (var mx = 0; mx < this.mapWidth; mx++)
            {
                row.push(1);
            }
            map.push(row);
        }

        var rooms = [];
        var maxRooms = 12;

        for (var i = 0; i < maxRooms; i++)
        {
            var w = Phaser.Math.Between(4, 10);
            var h = Phaser.Math.Between(4, 8);
            var x = Phaser.Math.Between(1, this.mapWidth - w - 1);
            var y = Phaser.Math.Between(1, this.mapHeight - h - 1);

            var overlaps = false;
            for (var r = 0; r < rooms.length; r++)
            {
                var room = rooms[r];
                if (x <= room.x + room.w + 1 && x + w >= room.x - 1 &&
                    y <= room.y + room.h + 1 && y + h >= room.y - 1)
                {
                    overlaps = true;
                    break;
                }
            }
            if (overlaps) continue;

            for (var ry = y; ry < y + h; ry++)
            {
                for (var rx = x; rx < x + w; rx++)
                {
                    map[ry][rx] = 0;
                }
            }

            if (rooms.length > 0)
            {
                var prev = rooms[rooms.length - 1];
                var prevCX = Math.floor(prev.x + prev.w / 2);
                var prevCY = Math.floor(prev.y + prev.h / 2);
                var currCX = Math.floor(x + w / 2);
                var currCY = Math.floor(y + h / 2);

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

            rooms.push({ x: x, y: y, w: w, h: h });
        }

        this.rooms = rooms;
        return map;
    }

    carveHCorridor (map, x1, x2, y)
    {
        var start = Math.min(x1, x2);
        var end = Math.max(x1, x2);
        for (var x = start; x <= end; x++)
        {
            if (y > 0 && y < this.mapHeight - 1) map[y][x] = 0;
        }
    }

    carveVCorridor (map, y1, y2, x)
    {
        var start = Math.min(y1, y2);
        var end = Math.max(y1, y2);
        for (var y = start; y <= end; y++)
        {
            if (x > 0 && x < this.mapWidth - 1) map[y][x] = 0;
        }
    }

    renderMap ()
    {
        for (var y = 0; y < this.mapHeight; y++)
        {
            for (var x = 0; x < this.mapWidth; x++)
            {
                var px = x * this.tileSize + this.tileSize / 2;
                var py = y * this.tileSize + this.tileSize / 2;
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
            var room = this.rooms[0];
            return {
                x: Math.floor(room.x + room.w / 2),
                y: Math.floor(room.y + room.h / 2)
            };
        }
        while (true)
        {
            var x = Phaser.Math.Between(1, this.mapWidth - 2);
            var y = Phaser.Math.Between(1, this.mapHeight - 2);
            if (this.map[y][x] === 0) return { x: x, y: y };
        }
    }

    findOpenTileInRoom (roomIndex)
    {
        var room = this.rooms[roomIndex];
        var attempts = 0;
        while (attempts < 50)
        {
            var x = Phaser.Math.Between(room.x, room.x + room.w - 1);
            var y = Phaser.Math.Between(room.y, room.y + room.h - 1);
            if (this.map[y][x] === 0) return { x: x, y: y };
            attempts++;
        }
        return null;
    }

    spawnEnemies (count)
    {
        for (var i = 0; i < count && i + 1 < this.rooms.length; i++)
        {
            var pos = this.findOpenTileInRoom(i + 1);
            if (!pos) continue;

            var enemy = this.enemies.create(
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
        for (var i = 1; i < this.rooms.length; i++)
        {
            if (Math.random() < 0.5)
            {
                var potPos = this.findOpenTileInRoom(i);
                if (potPos)
                {
                    this.potions.create(
                        potPos.x * this.tileSize + this.tileSize / 2,
                        potPos.y * this.tileSize + this.tileSize / 2,
                        'potion'
                    ).setDepth(5);
                }
            }
            var coinCount = Phaser.Math.Between(0, 3);
            for (var c = 0; c < coinCount; c++)
            {
                var coinPos = this.findOpenTileInRoom(i);
                if (coinPos)
                {
                    this.coins.create(
                        coinPos.x * this.tileSize + this.tileSize / 2,
                        coinPos.y * this.tileSize + this.tileSize / 2,
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

        var self = this;
        var attackRange = 28;
        var children = this.enemies.getChildren();
        for (var i = children.length - 1; i >= 0; i--)
        {
            var enemy = children[i];
            var dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, enemy.x, enemy.y
            );
            if (dist <= attackRange)
            {
                var damage = this.player.attack + Phaser.Math.Between(-3, 3);
                enemy.hp -= damage;
                this.showFloatingText(enemy.x, enemy.y - 12, '-' + damage, '#ffaa00');

                var angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, enemy.x, enemy.y);
                enemy.body.setVelocity(Math.cos(angle) * 120, Math.sin(angle) * 120);
                (function (e) {
                    self.time.delayedCall(150, function () {
                        if (e.active) e.body.setVelocity(0, 0);
                    });
                })(enemy);

                if (enemy.hp <= 0) this.defeatEnemy(enemy);
            }
        }

        this.player.setTint(0xffaa00);
        this.time.delayedCall(100, function () { self.player.clearTint(); });
        this.time.delayedCall(400, function () { self.attackCooldown = false; });
    }

    defeatEnemy (enemy)
    {
        this.showFloatingText(enemy.x, enemy.y - 12, 'Defeated!', '#ff4444');
        var goldDrop = Phaser.Math.Between(5, 20);
        this.player.gold += goldDrop;
        this.showFloatingText(enemy.x, enemy.y, '+' + goldDrop + ' Gold', '#ffd700');
        enemy.destroy();
        this.updateHUD();

        if (this.enemies.countActive() === 0)
        {
            this.showFloatingText(this.player.x, this.player.y - 24, 'Dungeon Cleared!', '#66ff66');
        }
    }

    showFloatingText (x, y, text, color)
    {
        var floatText = this.add.text(x, y, text, {
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
            onComplete: function () { floatText.destroy(); }
        });
    }

    createHUD ()
    {
        var padding = 10;
        var barWidth = 120;
        var barHeight = 12;

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
        var hpRatio = Math.max(0, this.player.hp / this.player.maxHp);
        this.hpBarFill.width = 120 * hpRatio;
        this.hpText.setText(Math.max(0, this.player.hp) + '/' + this.player.maxHp);

        if (hpRatio > 0.5) this.hpBarFill.setFillStyle(0xcc3333);
        else if (hpRatio > 0.25) this.hpBarFill.setFillStyle(0xcc7733);
        else this.hpBarFill.setFillStyle(0xcc0000);

        this.goldText.setText('Gold: ' + this.player.gold);
        this.potionText.setText('Potions: ' + this.player.potions + '  [E] use');
        this.enemyText.setText('Enemies: ' + this.enemies.countActive());
    }

    update ()
    {
        var vx = 0;
        var vy = 0;

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

        var self = this;
        var children = this.enemies.getChildren();
        for (var i = 0; i < children.length; i++)
        {
            var enemy = children[i];
            if (!enemy.active) continue;

            var dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, enemy.x, enemy.y
            );

            if (dist < enemy.aggroRange)
            {
                var angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.player.x, this.player.y);
                enemy.body.setVelocity(
                    Math.cos(angle) * enemy.speed * 1.2,
                    Math.sin(angle) * enemy.speed * 1.2
                );

                if (dist < 12 && !enemy.attackCooldown)
                {
                    this.player.hp -= enemy.attack;
                    this.showFloatingText(this.player.x, this.player.y - 12, '-' + enemy.attack, '#ff4444');
                    this.player.setTint(0xff0000);
                    this.time.delayedCall(150, function () { self.player.clearTint(); });
                    this.updateHUD();
                    enemy.attackCooldown = true;
                    (function (e) {
                        self.time.delayedCall(1000, function () { e.attackCooldown = false; });
                    })(enemy);

                    if (this.player.hp <= 0) this.gameOver();
                }
            }
            else
            {
                if (enemy.patrolTarget)
                {
                    var patrolDist = Phaser.Math.Distance.Between(
                        enemy.x, enemy.y, enemy.patrolTarget.x, enemy.patrolTarget.y
                    );
                    if (patrolDist < 4)
                    {
                        enemy.patrolTarget = this.getRandomPatrolPoint(this.rooms[enemy.homeRoom]);
                    }
                    var pAngle = Phaser.Math.Angle.Between(
                        enemy.x, enemy.y, enemy.patrolTarget.x, enemy.patrolTarget.y
                    );
                    enemy.body.setVelocity(
                        Math.cos(pAngle) * enemy.speed * 0.5,
                        Math.sin(pAngle) * enemy.speed * 0.5
                    );
                }
            }
        }

        this.updateHUD();
    }

    gameOver ()
    {
        this.physics.pause();
        this.player.setTint(0xff0000);

        var self = this;
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;

        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
            .setScrollFactor(0).setDepth(300);

        this.add.text(width / 2, height / 2 - 30, 'Game Over', {
            fontFamily: 'Georgia, serif',
            fontSize: '48px',
            color: '#cc3333',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301);

        this.add.text(width / 2, height / 2 + 20, 'Gold collected: ' + this.player.gold, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ffd700'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(301);

        var restartText = this.add.text(width / 2, height / 2 + 60, 'Click or press SPACE to restart', {
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

        this.input.once('pointerdown', function () { self.scene.restart(); });
        this.input.keyboard.once('keydown-SPACE', function () { self.scene.restart(); });
    }
}

// ---- Game Config ----
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [Boot, Preloader, MainMenu, Game],
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

var game = new Phaser.Game(config);
