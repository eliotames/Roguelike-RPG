// GameData.js
// Core data definitions and state for the text RPG.
// This file must be loaded BEFORE CharacterCreation.js and Game.js.

// ── Colour palette ──────────────────────────────────────────────

const CLR = {
    parchment:  '#e8d4c0',
    heading:    '#c4a265',
    choice:     '#8bb2ff',
    choiceHover:'#ffffff',
    success:    '#7dcc7d',
    failure:    '#cc7d7d',
    dim:        '#777777',
    body:       '#e06050',
    mind:       '#5090e0',
    soul:       '#50c878',
    charm:      '#e0c050',
    white:      '#ffffff',
    black:      '#000000',
    panelBg:    0x111118,
    panelBorder:0x444455,
};

// ── Attributes ──────────────────────────────────────────────────

const ATTR_DEFS = {
    body:  { name: 'Body',  color: CLR.body,
             desc: 'Physical power, endurance, and agility.' },
    mind:  { name: 'Mind',  color: CLR.mind,
             desc: 'Reasoning, awareness, and knowledge.' },
    soul:  { name: 'Soul',  color: CLR.soul,
             desc: 'Empathy, inner strength, and instinct.' },
    charm: { name: 'Charm', color: CLR.charm,
             desc: 'Persuasion, cunning, and presence.' },
};

const ATTR_KEYS = ['body', 'mind', 'soul', 'charm'];

// ── Skills (3 per attribute = 12 total) ─────────────────────────

const SKILL_DEFS = {
    might:      { name: 'Might',      attr: 'body',
                  desc: 'Raw physical force.' },
    endurance:  { name: 'Endurance',  attr: 'body',
                  desc: 'Stamina and resilience.' },
    reflexes:   { name: 'Reflexes',   attr: 'body',
                  desc: 'Speed and coordination.' },
    logic:      { name: 'Logic',      attr: 'mind',
                  desc: 'Deduction and analysis.' },
    perception: { name: 'Perception', attr: 'mind',
                  desc: 'Awareness and detail.' },
    lore:       { name: 'Lore',       attr: 'mind',
                  desc: 'Knowledge of the world.' },
    empathy:    { name: 'Empathy',    attr: 'soul',
                  desc: 'Understanding emotions.' },
    willpower:  { name: 'Willpower',  attr: 'soul',
                  desc: 'Mental fortitude.' },
    intuition:  { name: 'Intuition',  attr: 'soul',
                  desc: 'Gut feelings and instinct.' },
    rhetoric:   { name: 'Rhetoric',   attr: 'charm',
                  desc: 'Persuasion through argument.' },
    deception:  { name: 'Deception',  attr: 'charm',
                  desc: 'Misdirection and lies.' },
    authority:  { name: 'Authority',  attr: 'charm',
                  desc: 'Commanding presence.' },
};

const SKILL_KEYS = Object.keys(SKILL_DEFS);

// ── Species ─────────────────────────────────────────────────────

const SPECIES_LIST = [
    {
        id: 'human', name: 'Human',
        desc: 'Adaptable and ambitious. No innate bonuses, but two extra attribute points to place anywhere.',
        mods: { body: 0, mind: 0, soul: 0, charm: 0 },
        bonusAttrPoints: 2,
    },
    {
        id: 'elf', name: 'Elf',
        desc: 'Long-lived and perceptive. Sharp of mind and spirit, but slight of frame.',
        mods: { body: -1, mind: 1, soul: 1, charm: 0 },
        bonusAttrPoints: 0,
    },
    {
        id: 'dwarf', name: 'Dwarf',
        desc: 'Stout and unyielding. Strong body and iron will, but blunt in manner.',
        mods: { body: 1, mind: 0, soul: 1, charm: -1 },
        bonusAttrPoints: 0,
    },
    {
        id: 'halfling', name: 'Halfling',
        desc: 'Small and dangerously charming. What they lack in stature they make up in wit.',
        mods: { body: -1, mind: 0, soul: 0, charm: 2 },
        bonusAttrPoints: 0,
    },
];

// ── Cultures ────────────────────────────────────────────────────

const CULTURE_LIST = [
    {
        id: 'noble', name: 'Noble Born',
        desc: 'Raised among courts and politics. You learned to speak, command, and read between the lines.',
        skillBonuses: { rhetoric: 1, authority: 1, lore: 1 },
    },
    {
        id: 'street', name: 'Street Raised',
        desc: 'The city was your teacher. Quick hands, sharp eyes, a tongue that knows when to lie.',
        skillBonuses: { reflexes: 1, deception: 1, perception: 1 },
    },
    {
        id: 'wild', name: 'Wilderness Folk',
        desc: 'Born beyond the walls. You read weather, tracks, and silence.',
        skillBonuses: { endurance: 1, intuition: 1, perception: 1 },
    },
    {
        id: 'academic', name: 'Academy Trained',
        desc: 'Years of study and debate. Your mind is your sharpest tool.',
        skillBonuses: { logic: 1, lore: 2 },
    },
];

// ── Classes ─────────────────────────────────────────────────────

const CLASS_LIST = [
    {
        id: 'warrior', name: 'Warrior',
        desc: 'A fighter first. You trust your body and your blade.',
        attrBonus: { body: 1 },
        skillBonuses: { might: 1, endurance: 1 },
    },
    {
        id: 'rogue', name: 'Rogue',
        desc: 'A survivor. You prefer the indirect approach.',
        attrBonus: { charm: 1 },
        skillBonuses: { reflexes: 1, deception: 1 },
    },
    {
        id: 'scholar', name: 'Scholar',
        desc: 'A thinker. Knowledge is your weapon and shield.',
        attrBonus: { mind: 1 },
        skillBonuses: { logic: 1, lore: 1 },
    },
    {
        id: 'mystic', name: 'Mystic',
        desc: 'A seer. You sense what others cannot.',
        attrBonus: { soul: 1 },
        skillBonuses: { willpower: 1, intuition: 1 },
    },
];

// ── Difficulty labels ───────────────────────────────────────────

const DC_LABEL = {
    6: 'Trivial', 8: 'Easy', 10: 'Medium',
    12: 'Challenging', 14: 'Formidable',
    16: 'Heroic', 18: 'Legendary',
};

function getDCLabel (dc)
{
    return DC_LABEL[dc] || ('DC ' + dc);
}

// ── Game state (persists across scenes via this global) ─────────

const GameState = {

    player: {
        species: null,    // entry from SPECIES_LIST
        culture: null,    // entry from CULTURE_LIST
        pClass: null,     // entry from CLASS_LIST
        baseAttr: { body: 2, mind: 2, soul: 2, charm: 2 },
        hp: 10,
        maxHp: 10,
        inventory: [],
        flags: {},        // story flags
    },

    // Final attribute = base + species mod + class bonus
    getAttr (key)
    {
        const p = this.player;
        let v = p.baseAttr[key] || 0;
        if (p.species) v += p.species.mods[key] || 0;
        if (p.pClass && p.pClass.attrBonus)
            v += p.pClass.attrBonus[key] || 0;
        return Math.max(1, v);
    },

    // Skill level = parent attribute + culture bonus + class bonus
    getSkill (id)
    {
        const def = SKILL_DEFS[id];
        let v = this.getAttr(def.attr);
        const p = this.player;
        if (p.culture && p.culture.skillBonuses)
            v += p.culture.skillBonuses[id] || 0;
        if (p.pClass && p.pClass.skillBonuses)
            v += p.pClass.skillBonuses[id] || 0;
        return v;
    },

    // Active check: 2d6 + skill vs DC
    rollCheck (skillId, dc)
    {
        const skill = this.getSkill(skillId);
        const d1 = Phaser.Math.Between(1, 6);
        const d2 = Phaser.Math.Between(1, 6);
        const total = d1 + d2 + skill;
        return {
            skillId,
            skillName: SKILL_DEFS[skillId].name,
            level: skill,
            d1, d2, total, dc,
            label: getDCLabel(dc),
            success: total >= dc,
        };
    },

    // Passive check: skill level >= threshold (no dice)
    passiveCheck (skillId, threshold)
    {
        return this.getSkill(skillId) >= threshold;
    },

    // Derive HP from Body
    initHP ()
    {
        this.player.maxHp = 8 + this.getAttr('body') * 2;
        this.player.hp = this.player.maxHp;
    },

    setFlag (key, val) { this.player.flags[key] = val !== undefined ? val : true; },
    getFlag (key)      { return this.player.flags[key]; },
};