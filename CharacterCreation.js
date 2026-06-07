class CharacterCreation extends Phaser.Scene
{
    constructor ()
    {
        super('CharacterCreation');
    }

    create ()
    {
        this.step = 0;
        this.els = [];               // all UI elements for easy cleanup
        this.allocations = { body: 2, mind: 2, soul: 2, charm: 2 };
        this.poolSize = 6;           // recalculated after species pick
        this.showStep();
    }

    // ── helpers ─────────────────────────────────────────────────

    add_ (obj) { this.els.push(obj); return obj; }

    clearUI ()
    {
        this.els.forEach(o => o.destroy());
        this.els = [];
    }

    heading (y, text, size)
    {
        return this.add_(this.add.text(
            this.scale.width / 2, y, text,
            { font: (size || 32) + 'px monospace', color: CLR.heading }
        ).setOrigin(0.5));
    }

    body (x, y, text, cfg)
    {
        const defaults = {
            font: '16px monospace', color: CLR.parchment,
            wordWrap: { width: 680 }, lineSpacing: 6,
        };
        return this.add_(this.add.text(x, y, text,
            Object.assign(defaults, cfg || {})
        ));
    }

    dimText (x, y, text, cfg)
    {
        return this.body(x, y, text,
            Object.assign({ color: CLR.dim, font: '14px monospace' }, cfg || {}));
    }

    continueBtn (y, onClick)
    {
        const btn = this.add_(this.add.text(
            this.scale.width / 2, y, '[ CONTINUE \u2192 ]',
            { font: '22px monospace', color: CLR.choice }
        ).setOrigin(0.5).setAlpha(0));

        btn.setInteractive({ useHandCursor: true })
            .on('pointerover', () => btn.setColor(CLR.choiceHover))
            .on('pointerout',  () => btn.setColor(CLR.choice))
            .on('pointerdown', onClick);
        return btn;
    }

    // ── step router ─────────────────────────────────────────────

    showStep ()
    {
        this.clearUI();
        switch (this.step)
        {
            case 0: this.stepSpecies();    break;
            case 1: this.stepCulture();    break;
            case 2: this.stepClass();      break;
            case 3: this.stepAttributes(); break;
            case 4: this.stepSummary();    break;
        }
    }

    advance () { this.step++; this.showStep(); }

    // ── generic selection list (species / culture / class) ──────

    selectionStep (title, subtitle, list, modsFn, onPick)
    {
        const cx = this.scale.width / 2;
        this.heading(46, title);
        this.dimText(cx, 86, subtitle).setOrigin(0.5);

        const descBox = this.body(cx, 430, '', { font: '16px monospace' })
            .setOrigin(0.5, 0);
        const modBox = this.dimText(cx, 500, '').setOrigin(0.5, 0);
        const btn = this.continueBtn(620, () => this.advance());

        let selected = -1;
        const items = [];

        list.forEach((entry, i) =>
        {
            const y = 150 + i * 56;
            const t = this.add_(this.add.text(cx, y, entry.name, {
                font: '24px monospace', color: CLR.parchment,
            }).setOrigin(0.5).setInteractive({ useHandCursor: true }));

            t.on('pointerover', () => {
                if (selected !== i) t.setColor(CLR.choice);
                descBox.setText(entry.desc);
                modBox.setText(modsFn(entry));
            });

            t.on('pointerout', () => {
                if (selected !== i) t.setColor(CLR.parchment);
            });

            t.on('pointerdown', () => {
                if (selected >= 0) items[selected].setColor(CLR.parchment);
                selected = i;
                t.setColor(CLR.heading);
                descBox.setText(entry.desc);
                modBox.setText(modsFn(entry));
                btn.setAlpha(1);
                onPick(entry);
            });

            items.push(t);
        });
    }

    // ── step 0 : species ────────────────────────────────────────

    stepSpecies ()
    {
        this.selectionStep(
            'CHOOSE YOUR SPECIES',
            'Your species determines innate attribute modifiers.',
            SPECIES_LIST,
            (s) => {
                const parts = ATTR_KEYS
                    .map(k => ATTR_DEFS[k].name + ': '
                        + (s.mods[k] >= 0 ? '+' : '') + s.mods[k]);
                if (s.bonusAttrPoints)
                    parts.push('Bonus Points: +' + s.bonusAttrPoints);
                return parts.join('   ');
            },
            (s) => { GameState.player.species = s; }
        );
    }

    // ── step 1 : culture ────────────────────────────────────────

    stepCulture ()
    {
        this.selectionStep(
            'CHOOSE YOUR CULTURE',
            'Your upbringing shapes your starting skills.',
            CULTURE_LIST,
            (c) => {
                return Object.entries(c.skillBonuses)
                    .map(([k, v]) => SKILL_DEFS[k].name + ': +' + v)
                    .join('   ');
            },
            (c) => { GameState.player.culture = c; }
        );
    }

    // ── step 2 : class ──────────────────────────────────────────

    stepClass ()
    {
        this.selectionStep(
            'CHOOSE YOUR CLASS',
            'Your class grants attribute and skill bonuses.',
            CLASS_LIST,
            (c) => {
                const a = Object.entries(c.attrBonus || {})
                    .map(([k, v]) => ATTR_DEFS[k].name + ': +' + v);
                const s = Object.entries(c.skillBonuses || {})
                    .map(([k, v]) => SKILL_DEFS[k].name + ': +' + v);
                return a.concat(s).join('   ');
            },
            (c) => { GameState.player.pClass = c; }
        );
    }

    // ── step 3 : attribute allocation ───────────────────────────

    stepAttributes ()
    {
        const cx = this.scale.width / 2;
        const sp = GameState.player.species;
        this.poolSize = 6 + (sp ? sp.bonusAttrPoints || 0 : 0);

        // Reset allocations so pool maths are correct
        this.allocations = { body: 2, mind: 2, soul: 2, charm: 2 };
        this.spent = 0;

        this.heading(46, 'DISTRIBUTE ATTRIBUTES');
        this.dimText(cx, 86,
            'Each attribute starts at 2. Spend points below (min 1, max 6).')
            .setOrigin(0.5);

        // Points-remaining display
        this.poolText = this.body(cx, 125,
            'Points remaining: ' + this.poolSize,
            { font: '18px monospace', color: CLR.choice })
            .setOrigin(0.5);

        // Value texts stored for live update
        this.valTexts = {};

        ATTR_KEYS.forEach((key, i) =>
        {
            const y = 200 + i * 80;
            const def = ATTR_DEFS[key];

            // Label
            this.body(100, y, def.name, { font: '22px monospace', color: def.color });
            this.dimText(100, y + 28, def.desc);

            // Value
            this.valTexts[key] = this.body(440, y,
                String(this.allocations[key]),
                { font: '26px monospace', color: CLR.white }
            ).setOrigin(0.5, 0);

            // − button
            this.makeBtn(390, y + 2, '\u2212', () => {
                if (this.allocations[key] > 1)
                {
                    this.allocations[key]--;
                    this.spent--;
                    this.refreshAttrUI();
                }
            });

            // + button
            this.makeBtn(490, y + 2, '+', () => {
                if (this.allocations[key] < 6 && this.spent < this.poolSize)
                {
                    this.allocations[key]++;
                    this.spent++;
                    this.refreshAttrUI();
                }
            });

            // Final value preview (includes species + class mods)
            this.valTexts[key + '_final'] = this.dimText(540, y + 4, '');
        });

        this.refreshAttrUI();

        this.attrContinue = this.continueBtn(600, () => {
            // Commit allocations to GameState
            GameState.player.baseAttr = Object.assign({}, this.allocations);
            this.advance();
        });
        this.attrContinue.setAlpha(1);
    }

    makeBtn (x, y, label, cb)
    {
        const bg = this.add_(
            this.add.rectangle(x, y + 10, 34, 34, 0x333344)
                .setStrokeStyle(1, 0x666677)
                .setInteractive({ useHandCursor: true })
        );
        const txt = this.add_(
            this.add.text(x, y + 10, label,
                { font: '22px monospace', color: CLR.white }).setOrigin(0.5)
        );
        bg.on('pointerdown', cb);
        bg.on('pointerover', () => bg.setFillStyle(0x555566));
        bg.on('pointerout',  () => bg.setFillStyle(0x333344));
    }

    refreshAttrUI ()
    {
        const remaining = this.poolSize - this.spent;
        this.poolText.setText('Points remaining: ' + remaining);

        ATTR_KEYS.forEach(key =>
        {
            this.valTexts[key].setText(String(this.allocations[key]));

            // Temporarily set baseAttr to preview final value
            const saved = GameState.player.baseAttr[key];
            GameState.player.baseAttr[key] = this.allocations[key];
            const final = GameState.getAttr(key);
            GameState.player.baseAttr[key] = saved;

            const sp = GameState.player.species;
            const mod = (sp ? sp.mods[key] || 0 : 0)
                      + (GameState.player.pClass
                         ? (GameState.player.pClass.attrBonus || {})[key] || 0 : 0);
            const tag = mod !== 0
                ? '  \u2192 ' + final + ' (' + (mod >= 0 ? '+' : '') + mod + ')'
                : '';
            this.valTexts[key + '_final'].setText(tag);
        });
    }

    // ── step 4 : summary ────────────────────────────────────────

    stepSummary ()
    {
        const cx = this.scale.width / 2;
        const p = GameState.player;
        GameState.initHP();

        this.heading(40, 'CHARACTER SUMMARY');

        const tagline = p.species.name + '  \u00B7  '
                      + p.culture.name + '  \u00B7  '
                      + p.pClass.name;
        this.body(cx, 85, tagline, { font: '18px monospace' })
            .setOrigin(0.5);

        // Attributes
        this.body(120, 140, 'ATTRIBUTES',
            { font: '18px monospace', color: CLR.heading });

        ATTR_KEYS.forEach((key, i) =>
        {
            const y = 175 + i * 30;
            const def = ATTR_DEFS[key];
            const val = GameState.getAttr(key);
            this.body(140, y, def.name,
                { font: '16px monospace', color: def.color });
            this.body(260, y, String(val),
                { font: '16px monospace', color: CLR.white });
        });

        // Skills
        this.body(420, 140, 'SKILLS',
            { font: '18px monospace', color: CLR.heading });

        SKILL_KEYS.forEach((id, i) =>
        {
            const col = i < 6 ? 0 : 1;
            const row = i < 6 ? i : i - 6;
            const x = 440 + col * 220;
            const y = 175 + row * 30;
            const def = SKILL_DEFS[id];
            const val = GameState.getSkill(id);
            const attrClr = ATTR_DEFS[def.attr].color;
            this.body(x, y, def.name + ': ' + val,
                { font: '15px monospace', color: attrClr });
        });

        // HP
        this.body(120, 320, 'HP: ' + p.hp + ' / ' + p.maxHp,
            { font: '18px monospace', color: CLR.success });

        // Decorative line
        this.add_(this.add.rectangle(cx, 380, 700, 1, 0x444455));

        // Begin button
        const btn = this.add_(this.add.text(cx, 440,
            '[ BEGIN YOUR JOURNEY ]',
            { font: '26px monospace', color: CLR.choice }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true }));

        btn.on('pointerover', () => btn.setColor(CLR.choiceHover));
        btn.on('pointerout',  () => btn.setColor(CLR.choice));
        btn.on('pointerdown', () => this.scene.start('Game'));
    }
}