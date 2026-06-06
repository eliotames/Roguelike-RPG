var Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function Game ()
    {
        Phaser.Scene.call(this, 'Game');
    },

    create: function ()
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
    },

    generateMap: function ()
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
    },

    carveHCorridor: function (map, x1, x2, y)
    {
        var start = Math.min(x1, x2);
        var end = Math.max(x1, x2);
        for (var x = start; x <= end; x++)
        {
            if (y > 0 && y < this.mapHeight - 1) map[y][x] = 0;
        }
    },

    carveVCorridor: function (map, y1, y2, x)
    {
        var start = Math.min(y1, y2);
        var end = Math.max(y1, y2);
        for (var y = start; y <= end; y++)
        {
            if (x > 0 && x < this.mapWidth - 1) map[y][x] = 0;
        }
    },

    renderMap: function ()
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
    },

    findOpenTile: function ()
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
    },

    findOpenTileInRoom: function (roomIndex)
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
    },

    spawnEnemies: function (count)
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
    },

    getRandomPatrolPoint: function (room)
    {
        return {
            x: Phaser.Math.Between(room.x + 1, room.x + room.w - 2) * this.tileSize + this.tileSize / 2,
            y: Phaser.Math.Between(room.y + 1, room.y + room.h - 2) * this.tileSize + this.tileSize / 2
        };
    },

    spawnItems: function ()
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
    },

    collectPotion: function (player, potion)
    {
        potion.destroy();
        this.player.potions++;
        this.showFloatingText(player.x, player.y - 12, '+1 Potion', '#ff6666');
        this.updateHUD();
    },

    collectCoin: function (player, coin)
    {
        coin.destroy();
        this.player.gold += 10;
        this.showFloatingText(player.x, player.y - 12, '+10 Gold', '#ffd700');
        this.updateHUD();
    },

    usePotion: function ()
    {
        if (this.player.potions > 0 && this.player.hp < this.player.maxHp)
        {
            this.player.potions--;
            this.player.hp = Math.min(this.player.hp + 30, this.player.maxHp);
            this.showFloatingText(this.player.x, this.player.y - 12, '+30 HP', '#66ff66');
            this.updateHUD();
        }
    },

    playerAttack: function ()
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
    },

    defeatEnemy: function (enemy)
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
    },

    showFloatingText: function (x, y, text, color)
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
    },

    createHUD: function ()
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
    },

    updateHUD: function ()
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
    },

    update: function ()
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
    },

    gameOver: function ()
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
});
