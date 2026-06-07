// ── Story content ───────────────────────────────────────────────
// Each node: title, text[], passiveChecks[], choices[]
// Choices may include a check { skill, dc } for an active roll.

const STORY = {

    intro_wake: {
        title: 'Unknown Room',
        text: [
            'You open your eyes to unfamiliar darkness.',
            'A low ceiling. Rough wooden beams. The smell of stale ale and candle wax.',
            'You are lying on a narrow bed in what seems to be a room above a tavern. Your head aches, and your memories feel scattered \u2014 like pages torn from a book and thrown to the wind.',
        ],
        passiveChecks: [
            { skill: 'perception', dc: 3,
              text: 'A thin line of grey light seeps beneath the door. Early morning. Faint sounds drift up from below \u2014 someone is already awake.' },
            { skill: 'intuition', dc: 4,
              text: 'Something nags at you. Not grief \u2014 something practical. You had something important, and it is gone.' },
        ],
        choices: [
            { text: 'Examine the room.', next: 'intro_room' },
            { text: 'Try to piece together your memories.',
              check: { skill: 'logic', dc: 10 },
              successText: 'The fragments are dim, but your mind catches their edges\u2026',
              failText: 'You reach for the memories, but they dissolve like morning fog\u2026',
              next: 'intro_memory_yes', fail: 'intro_memory_no' },
            { text: 'Head downstairs.', next: 'intro_tavern' },
        ],
    },

    intro_room: {
        title: 'Unknown Room',
        text: [
            'The room is small and sparsely furnished. A wooden chair, a washstand with a cracked mirror, a single shuttered window.',
            'On the chair sits a worn leather satchel \u2014 yours, you think. Inside: a handful of copper coins, a stub of charcoal, and a folded scrap of paper.',
        ],
        passiveChecks: [
            { skill: 'perception', dc: 4,
              text: 'Scratches on the floor near the door. Recent ones. Someone dragged something heavy through here \u2014 or was dragged.' },
            { skill: 'lore', dc: 5,
              text: 'The symbol carved into the doorframe is a ward-mark \u2014 old folk magic, meant to keep nightmares out. Someone here is superstitious, or careful.' },
        ],
        choices: [
            { text: 'Read the note.', next: 'intro_note' },
            { text: 'Head downstairs.', next: 'intro_tavern' },
        ],
    },

    intro_note: {
        title: 'A Scrap of Paper',
        text: [
            'The paper is creased and smudged. The handwriting is hurried but clear:',
            '"Find Maren. The Crossed Keys. Trust no one else."',
            'The name stirs nothing in your memory. But the urgency in the ink is unmistakable \u2014 whoever wrote this was afraid.',
        ],
        passiveChecks: [],
        choices: [
            { text: 'Pocket the note and head downstairs.', next: 'intro_tavern' },
        ],
    },

    intro_memory_yes: {
        title: 'Fragments',
        text: [
            'You close your eyes and concentrate. Slowly, images surface.',
            'A road through dark woods. Rain. The sound of hooves behind you, gaining. A light between the trees that should not have been there.',
            'Then nothing. A gap. And then this bed, this room, this headache.',
            'It is not much. But it is something.',
        ],
        passiveChecks: [],
        choices: [
            { text: 'Examine the room.', next: 'intro_room' },
            { text: 'Head downstairs.', next: 'intro_tavern' },
        ],
    },

    intro_memory_no: {
        title: 'Fog',
        text: [
            'You close your eyes and try to focus, but the harder you grasp, the faster the memories scatter.',
            'Shapes. Sounds. The smell of wet earth. None of it holds together.',
            'You will have to find your answers another way.',
        ],
        passiveChecks: [],
        choices: [
            { text: 'Examine the room.', next: 'intro_room' },
            { text: 'Head downstairs.', next: 'intro_tavern' },
        ],
    },

    intro_tavern: {
        title: 'The Common Room',
        text: [
            'You descend a narrow staircase into the tavern\u2019s common room. It is early \u2014 the chairs are still stacked on half the tables, and the fire in the hearth has burned down to embers.',
            'Behind the bar, a broad-shouldered woman is polishing mugs with the mechanical rhythm of long practice. She glances up as you enter.',
            '"Awake, then," she says. Not a question.',
        ],
        passiveChecks: [
            { skill: 'empathy', dc: 4,
              text: 'Her tone is guarded, but there is something underneath it \u2014 concern, perhaps, or relief. She was worried about you.' },
        ],
        choices: [
            { text: '"Where am I? What happened to me?"',
              next: 'intro_keeper_talk' },
            { text: 'Try to read her expression before speaking.',
              check: { skill: 'empathy', dc: 10 },
              successText: 'Her eyes tell you more than her words will.',
              failText: 'Her face gives away nothing.',
              next: 'intro_keeper_read_yes', fail: 'intro_keeper_talk' },
            { text: '"I\u2019m looking for someone called Maren."',
              check: { skill: 'rhetoric', dc: 12 },
              successText: 'The directness catches her off guard. Her mask slips.',
              failText: 'She stiffens. Too direct, too soon.',
              next: 'intro_keeper_maren_yes', fail: 'intro_keeper_maren_no' },
        ],
    },

    intro_keeper_talk: {
        title: 'The Common Room',
        text: [
            '"You\u2019re at the Dusty Flagon," she says, setting down a mug. "Village of Thornfield. You were brought in two nights ago by a trader who found you on the east road, out cold in the rain."',
            'She studies you for a moment.',
            '"You don\u2019t remember, do you?"',
        ],
        passiveChecks: [],
        choices: [
            { text: '"No. I don\u2019t."', next: 'intro_keeper_info' },
            { text: '"Does the name Maren mean anything to you?"',
              next: 'intro_keeper_maren_ask' },
        ],
    },

    intro_keeper_read_yes: {
        title: 'The Common Room',
        text: [
            'You hold her gaze, and for a moment the mask drops. She is tired \u2014 bone tired \u2014 and afraid, though not of you.',
            '"You can see it too, can\u2019t you," she murmurs. "The wrongness."',
            'She sets the mug down and lowers her voice. "Things have been strange in Thornfield. Folk going missing. Lights in the woods after dark. And then you show up, half-dead on the road, with no memory."',
        ],
        passiveChecks: [],
        choices: [
            { text: '"Tell me about the missing people."',
              next: 'intro_keeper_info' },
            { text: '"Does the name Maren mean anything to you?"',
              next: 'intro_keeper_maren_ask' },
        ],
    },

    intro_keeper_maren_yes: {
        title: 'The Common Room',
        text: [
            'Her hand freezes on the mug. Just for a heartbeat \u2014 but you catch it.',
            '"Maren left," she says quietly. "Two days before you arrived. Headed east, toward the old forest. Said she had business there."',
            'She meets your eyes. "If you\u2019re a friend of hers, you should know \u2014 the people who went looking for her haven\u2019t come back."',
        ],
        passiveChecks: [],
        choices: [
            { text: '"Then I\u2019d better go find her."',
              next: 'intro_outside' },
        ],
    },

    intro_keeper_maren_no: {
        title: 'The Common Room',
        text: [
            'Her expression closes like a door. "Don\u2019t know the name," she says flatly, and turns back to her mugs.',
            'You are fairly certain she is lying. But pushing harder now would only make things worse.',
        ],
        passiveChecks: [],
        choices: [
            { text: '"Fine. Tell me about this village, then."',
              next: 'intro_keeper_info' },
            { text: 'Give up and head outside.', next: 'intro_outside' },
        ],
    },

    intro_keeper_maren_ask: {
        title: 'The Common Room',
        text: [
            'She hesitates. "Maren was a healer. Lived on the edge of the village, kept to herself mostly. She left about four days ago. Headed east toward the old forest."',
            '"She didn\u2019t say why. But I saw her packing like someone who didn\u2019t expect to come back."',
        ],
        passiveChecks: [],
        choices: [
            { text: '"I need to find her."', next: 'intro_outside' },
        ],
    },

    intro_keeper_info: {
        title: 'The Common Room',
        text: [
            '"Three people gone in the last two weeks," she says. "A woodcutter. A shepherd boy. Old Hester who lives by the mill. All last seen heading toward the east road."',
            '"The elder says it\u2019s wolves. But wolves don\u2019t leave the doors locked from the outside."',
            'She slides a cup of something warm across the bar to you. "Whatever you\u2019re mixed up in \u2014 be careful out there."',
        ],
        passiveChecks: [
            { skill: 'intuition', dc: 4,
              text: 'She knows more than she is saying. But she has chosen to help you this much, and that counts for something.' },
        ],
        choices: [
            { text: 'Thank her and head outside.', next: 'intro_outside' },
        ],
    },

    intro_outside: {
        title: 'Thornfield \u2014 Village Square',
        text: [
            'You step through the tavern door into pale morning light.',
            'Thornfield is a small village \u2014 a handful of stone-and-timber buildings arranged around a muddy square. A well stands at its centre, and beyond the last house, a dirt road winds east into dark woods.',
            'Somewhere out there is Maren. And answers.',
            'Your journey begins.',
        ],
        passiveChecks: [],
        choices: [
            { text: '[ End of introduction \u2014 more to come ]',
              next: '_end' },
        ],
    },

};

// ── Game scene ──────────────────────────────────────────────────

class Game extends Phaser.Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // Layout constants
        this.LX = 80;                // left margin for text
        this.TW = 860;               // text wrap width
        this.TY = 90;                // top of text area
        this.CY = 0;                 // set dynamically after text
        this.choiceEls = [];
        this.uiEls = [];
        this.statsOpen = false;
        this.statsEls = [];
        this.isTyping = false;
        this.fullText = '';

        // Thin top bar
        this.titleBar = this.add.rectangle(
            this.scale.width / 2, 24, this.scale.width, 48, 0x0a0a12
        );
        this.titleText = this.add.text(this.LX, 14, '', {
            font: '18px monospace', color: CLR.heading,
        });

        // Stats button
        const sb = this.add.text(this.scale.width - 80, 14, '[ STATS ]', {
            font: '14px monospace', color: CLR.dim,
        }).setInteractive({ useHandCursor: true });
        sb.on('pointerdown', () => this.toggleStats());
        sb.on('pointerover', () => sb.setColor(CLR.choice));
        sb.on('pointerout',  () => sb.setColor(CLR.dim));

        // Main text object (persistent, content replaced per node)
        this.mainText = this.add.text(this.LX, this.TY, '', {
            font: '18px monospace', color: CLR.parchment,
            wordWrap: { width: this.TW }, lineSpacing: 10,
        });

        // Click-to-skip handler
        this.input.on('pointerdown', () =>
        {
            if (this.isTyping)
            {
                this.skipTypewriter();
            }
        });

        // Start the story
        this.displayNode('intro_wake');
    }

    // ── node display ────────────────────────────────────────────

    displayNode (nodeId)
    {
        if (nodeId === '_end')
        {
            this.showEnd();
            return;
        }

        const node = STORY[nodeId];
        if (!node) { console.warn('Missing node:', nodeId); return; }

        this.clearChoices();
        this.titleText.setText(node.title || '');

        // Build full text: paragraphs + passive check inserts
        const parts = node.text.slice();

        if (node.passiveChecks)
        {
            node.passiveChecks.forEach(pc =>
            {
                if (GameState.passiveCheck(pc.skill, pc.dc))
                {
                    const sn = SKILL_DEFS[pc.skill].name.toUpperCase();
                    parts.push('[' + sn + '] ' + pc.text);
                }
            });
        }

        this.fullText = parts.join('\n\n');
        this.startTypewriter(this.fullText, () =>
        {
            this.showChoices(node.choices);
        });
    }

    // ── typewriter ──────────────────────────────────────────────

    startTypewriter (text, onDone)
    {
        this.mainText.setText('');
        this.isTyping = true;
        this.typeCallback = onDone;
        let i = 0;

        this.typeTimer = this.time.addEvent({
            delay: 16,
            callback: () =>
            {
                i += 2;                             // two chars per tick
                if (i >= text.length)
                {
                    i = text.length;
                    this.mainText.setText(text);
                    this.finishTypewriter();
                }
                else
                {
                    this.mainText.setText(text.substring(0, i));
                }
            },
            loop: true,
        });
    }

    skipTypewriter ()
    {
        if (!this.isTyping) return;
        this.mainText.setText(this.fullText);
        this.finishTypewriter();
    }

    finishTypewriter ()
    {
        this.isTyping = false;
        if (this.typeTimer) { this.typeTimer.destroy(); this.typeTimer = null; }
        if (this.typeCallback) { const cb = this.typeCallback; this.typeCallback = null; cb(); }
    }

    // ── choices ─────────────────────────────────────────────────

    clearChoices ()
    {
        this.choiceEls.forEach(o => o.destroy());
        this.choiceEls = [];
    }

    showChoices (choices)
    {
        if (!choices || choices.length === 0) return;

        // Position choices below the text
        const bounds = this.mainText.getBounds();
        let y = Math.max(bounds.bottom + 40, 480);

        choices.forEach(choice =>
        {
            let label = choice.text;
            if (choice.check)
            {
                const sn = SKILL_DEFS[choice.check.skill].name.toUpperCase();
                label = '[' + sn + ' ' + getDCLabel(choice.check.dc) + '] '
                      + choice.text;
            }

            const t = this.add.text(this.LX + 16, y, '\u25B8 ' + label, {
                font: '17px monospace', color: CLR.choice,
                wordWrap: { width: this.TW - 32 }, lineSpacing: 4,
            }).setInteractive({ useHandCursor: true });

            t.on('pointerover', () => t.setColor(CLR.choiceHover));
            t.on('pointerout',  () => t.setColor(CLR.choice));
            t.on('pointerdown', () => this.handleChoice(choice));

            this.choiceEls.push(t);
            y += t.getBounds().height + 12;
        });
    }

    // ── choice handling & active checks ─────────────────────────

    handleChoice (choice)
    {
        this.clearChoices();

        if (!choice.check)
        {
            this.displayNode(choice.next);
            return;
        }

        // Active skill check
        const result = GameState.rollCheck(choice.check.skill, choice.check.dc);
        this.showCheckResult(result, choice);
    }

    showCheckResult (r, choice)
    {
        const skillColor = ATTR_DEFS[SKILL_DEFS[r.skillId].attr].color;
        const outcomeColor = r.success ? CLR.success : CLR.failure;
        const outcomeWord = r.success ? 'Success' : 'Failure';

        // Header line
        const header = r.skillName.toUpperCase() + '  ['
            + r.label + ': ' + outcomeWord
            + ' \u2014 ' + r.total + ' vs ' + r.dc + ']';

        const flavor = r.success
            ? (choice.successText || 'You succeed.')
            : (choice.failText || 'You fail.');

        const bounds = this.mainText.getBounds();
        let y = bounds.bottom + 30;

        const line = this.add.rectangle(
            this.scale.width / 2, y, this.TW, 1, 0x444455);
        y += 20;

        const hdr = this.add.text(this.LX, y, header, {
            font: '16px monospace', color: skillColor,
        });
        y += 30;

        const flv = this.add.text(this.LX, y, flavor, {
            font: '17px monospace', color: outcomeColor,
            wordWrap: { width: this.TW }, lineSpacing: 6,
        });
        y += flv.getBounds().height + 24;

        const cont = this.add.text(this.LX, y, '\u25B8 Continue\u2026', {
            font: '17px monospace', color: CLR.choice,
        }).setInteractive({ useHandCursor: true });

        cont.on('pointerover', () => cont.setColor(CLR.choiceHover));
        cont.on('pointerout',  () => cont.setColor(CLR.choice));
        cont.on('pointerdown', () =>
        {
            [line, hdr, flv, cont].forEach(o => o.destroy());
            const next = r.success ? choice.next : (choice.fail || choice.next);
            this.displayNode(next);
        });

        this.choiceEls.push(line, hdr, flv, cont);
    }

    // ── stats overlay ───────────────────────────────────────────

    toggleStats ()
    {
        if (this.statsOpen) { this.closeStats(); return; }
        this.statsOpen = true;
        const p = GameState.player;

        const pw = 340;
        const ph = 520;
        const px = this.scale.width - pw - 20;
        const py = 56;

        const bg = this.add.rectangle(px + pw / 2, py + ph / 2,
            pw, ph, CLR.panelBg, 0.92)
            .setStrokeStyle(1, CLR.panelBorder).setDepth(200);
        this.statsEls.push(bg);

        let y = py + 16;
        const ln = (x, yy, txt, cfg) =>
        {
            const t = this.add.text(x, yy, txt,
                Object.assign({ font: '14px monospace', color: CLR.parchment }, cfg || {}))
                .setDepth(201);
            this.statsEls.push(t);
            return t;
        };

        const lx = px + 20;

        ln(lx, y, p.species.name + '  \u00B7  ' + p.culture.name
            + '  \u00B7  ' + p.pClass.name, { color: CLR.heading });
        y += 30;

        ln(lx, y, 'ATTRIBUTES', { color: CLR.heading, font: '13px monospace' });
        y += 22;
        ATTR_KEYS.forEach(k =>
        {
            ln(lx, y, ATTR_DEFS[k].name + ': ' + GameState.getAttr(k),
                { color: ATTR_DEFS[k].color });
            y += 20;
        });

        y += 12;
        ln(lx, y, 'SKILLS', { color: CLR.heading, font: '13px monospace' });
        y += 22;
        SKILL_KEYS.forEach(id =>
        {
            const d = SKILL_DEFS[id];
            ln(lx, y, d.name + ': ' + GameState.getSkill(id),
                { color: ATTR_DEFS[d.attr].color });
            y += 20;
        });

        y += 12;
        ln(lx, y, 'HP: ' + p.hp + ' / ' + p.maxHp, { color: CLR.success });

        // Close button
        const cb = this.add.text(px + pw - 30, py + 8, '\u2715', {
            font: '18px monospace', color: CLR.dim,
        }).setDepth(202).setInteractive({ useHandCursor: true });
        cb.on('pointerdown', () => this.closeStats());
        cb.on('pointerover', () => cb.setColor(CLR.white));
        cb.on('pointerout',  () => cb.setColor(CLR.dim));
        this.statsEls.push(cb);
    }

    closeStats ()
    {
        this.statsOpen = false;
        this.statsEls.forEach(o => o.destroy());
        this.statsEls = [];
    }

    // ── end screen ──────────────────────────────────────────────

    showEnd ()
    {
        this.clearChoices();
        this.titleText.setText('');
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        this.mainText.setText('');

        this.add.rectangle(cx, cy - 30, 500, 1, 0xc4a265);

        this.add.text(cx, cy, 'End of Introduction', {
            font: '32px monospace', color: CLR.heading,
        }).setOrigin(0.5);

        this.add.text(cx, cy + 50,
            'The framework is in place. Your story continues from here.', {
            font: '16px monospace', color: CLR.parchment,
            wordWrap: { width: 600 }, align: 'center',
        }).setOrigin(0.5);
    }
}

// ── Phaser config ───────────────────────────────────────────────

const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#08080f',
    scale: {
        mode: Phaser.Scale.FIT,
    },
    scene: [Boot, Preloader, MainMenu, CharacterCreation, Game],
};

const game = new Phaser.Game(config);