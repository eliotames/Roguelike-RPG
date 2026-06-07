// StoryIntro.js
// The introductory tavern scene.
// Nodes are added to the global STORY registry defined in GameData.js.
//
// Node reference:
//   title          – location name shown in the title bar
//   text[]         – paragraphs of body text
//   passiveChecks  – fire automatically if skill >= dc
//   choices[]      – player options; may include an active check

Object.assign(STORY, {

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

});