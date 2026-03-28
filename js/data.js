// ===== BG3 Party Builder Data =====

const CHARACTERS = {
    tav: {
        id: 'tav',
        name: 'Tav',
        emoji: '🏹',
        role: 'DPS Ranged',
        race: 'Wood Half-Elf',
        class: 'Ranger / Rogue',
        subclass: 'Gloom Stalker / Assassin',
        description: 'O melhor arqueiro do jogo. Dano absurdo no primeiro turno com combinação de stealth e critical hits.',
        color: 'tav',
        stats: {
            STR: 10, DEX: 16, CON: 14,
            INT: 8, WIS: 14, CHA: 12
        },
        fightingStyle: 'Archery (+2 acerto com arco)',
        background: 'Urchin (Stealth + Sleight of Hand)',
        keyAbilities: ['Dread Ambusher', 'Sneak Attack', 'Assassinate', 'Sharpshooter'],
        spells: ['Hunter\'s Mark', 'Ensnaring Strike', 'Disguise Self'],
        progression: [
            { level: 1, class: 'Ranger', choices: 'Favoured Enemy: Bounty Hunter, Natural Explorer: Urban' },
            { level: 2, class: 'Ranger', choices: 'Archery Fighting Style, Spells: Hunter\'s Mark + Ensnaring Strike' },
            { level: 3, class: 'Ranger', choices: '⭐ Gloom Stalker — Dread Ambusher (ataque extra no 1º turno!)' },
            { level: 4, class: 'Ranger', choices: '⭐ Feat: Sharpshooter (-5 acerto, +10 dano)' },
            { level: 5, class: 'Ranger', choices: 'Extra Attack (2 ataques por turno)' },
            { level: 6, class: 'Rogue', choices: 'Sneak Attack 1d6' },
            { level: 7, class: 'Rogue', choices: 'Cunning Action (Dash/Hide como ação bônus)' },
            { level: 8, class: 'Rogue', choices: '⭐ Assassin — Critical garantido em inimigos surpresos!' },
            { level: 9, class: 'Rogue', choices: '⭐ Feat: Ability Improvement (+2 DEX → 18)' },
            { level: 10, class: 'Rogue', choices: 'Evasion, Sneak Attack 2d6' },
            { level: 11, class: 'Rogue', choices: '⭐ Feat: Alert (+5 iniciativa, não pode ser surpreso)' },
            { level: 12, class: 'Rogue', choices: 'Reliable Talent, Sneak Attack 3d6' },
        ],
        combo: [
            'Entra em stealth antes do combate',
            'Atira com Surpresa (inimigo surpreso)',
            '1º turno: 2 ataques + Dread Ambusher (1 extra) + Assassin crit',
            'Dano: ~60-100+ no primeiro turno! 💀'
        ],
        equipment: [
            { name: 'Titanstring Bow', note: 'Adiciona STR ao dano' },
            { name: 'Medium Armor', note: 'DEX mod conta para AC' },
            { name: 'Broodmother\'s Revenge', note: 'Dano extra de veneno' },
            { name: 'Caustic Bulb', note: 'Consomível, dano de ácido em área' }
        ]
    },
    laezel: {
        id: 'laezel',
        name: 'Lae\'zel',
        emoji: '⚔️',
        role: 'DPS Melee',
        race: 'Githyanki',
        class: 'Fighter',
        subclass: 'Battle Master',
        description: 'Tank/DPS corpo a corpo que dá dano alto e controla o campo com manobras. 3 ataques por turno no nível 11.',
        color: 'laezel',
        stats: {
            STR: 17, DEX: 13, CON: 15,
            INT: 10, WIS: 12, CHA: 8
        },
        fightingStyle: 'Great Weapon Fighting',
        background: 'Soldier (Athletics + Intimidation)',
        keyAbilities: ['Action Surge', 'Riposte', 'Precision Attack', 'Trip Attack'],
        spells: [],
        progression: [
            { level: 1, class: 'Fighter', choices: 'Great Weapon Fighting Style' },
            { level: 2, class: 'Fighter', choices: 'Action Surge (turno dobrado!)' },
            { level: 3, class: 'Fighter', choices: '⭐ Battle Master — Maneuvers: Riposte, Precision, Trip Attack' },
            { level: 4, class: 'Fighter', choices: '⭐ Feat: Great Weapon Master (-5 acerto, +10 dano)' },
            { level: 5, class: 'Fighter', choices: 'Extra Attack (2 ataques por turno)' },
            { level: 6, class: 'Fighter', choices: '⭐ Feat: Ability Improvement (+2 STR → 18)' },
            { level: 7, class: 'Fighter', choices: 'Maneuvers extras: Menacing, Disarming Attack' },
            { level: 8, class: 'Fighter', choices: '⭐ Feat: Ability Improvement (+2 STR → 20)' },
            { level: 9, class: 'Fighter', choices: 'Indomitable (rerrolar save)' },
            { level: 10, class: 'Fighter', choices: 'Maneuver improvement (+d8 → +d10)' },
            { level: 11, class: 'Fighter', choices: '⭐ Extra Attack (2) — 3 ATAQUES POR TURNO!' },
            { level: 12, class: 'Fighter', choices: '⭐ Feat: Savage Attacker ou Alert' },
        ],
        combo: [
            'Githyanki Psionics: Jump + Misty Step pra chegar nos inimigos',
            'Action Surge = turno dobrado (6 ataques no Lv 11!)',
            'Trip Attack derruba o inimigo, ganha vantagem nos próximos',
            'GWM com vantagem = dano massivo'
        ],
        equipment: [
            { name: 'Silver Sword of the Astral Plane', note: 'Espada lendária githyanki' },
            { name: 'Heavy Armor (Plate)', note: 'AC máxima' },
            { name: 'Githyanki Half Plate', note: 'Bonificações raciais' },
            { name: 'Gloves of Power', note: 'Dano extra em unarmed' }
        ]
    },
    karlach: {
        id: 'karlach',
        name: 'Karlach',
        emoji: '🔥',
        role: 'Tank / DPS',
        race: 'Zariel Tiefling',
        class: 'Barbarian',
        subclass: 'Berserker',
        description: 'Dano bruto e resistência. Ela bate forte e não morre. Rage + Frenzy = destruição.',
        color: 'karlach',
        stats: {
            STR: 16, DEX: 14, CON: 16,
            INT: 8, WIS: 10, CHA: 12
        },
        fightingStyle: 'N/A (Barbarian)',
        background: 'Outlander (Athletics + Survival)',
        keyAbilities: ['Rage', 'Reckless Attack', 'Frenzy', 'Brutal Critical'],
        spells: [],
        progression: [
            { level: 1, class: 'Barbarian', choices: 'Rage (dano extra + resistência a dano físico)' },
            { level: 2, class: 'Barbarian', choices: 'Reckless Attack (vantagem garantida!)' },
            { level: 3, class: 'Barbarian', choices: '⭐ Berserker — Frenzy (ataque bônus extra)' },
            { level: 4, class: 'Barbarian', choices: '⭐ Feat: Great Weapon Master (-5 acerto, +10 dano)' },
            { level: 5, class: 'Barbarian', choices: 'Extra Attack, Fast Movement (+3m)' },
            { level: 6, class: 'Barbarian', choices: 'Mindless Rage (imune a charm/frighten)' },
            { level: 7, class: 'Barbarian', choices: 'Feral Instinct (+3 iniciativa)' },
            { level: 8, class: 'Barbarian', choices: '⭐ Feat: Ability Improvement (+2 STR → 18)' },
            { level: 9, class: 'Barbarian', choices: 'Brutal Critical (+1 dado de dano crítico)' },
            { level: 10, class: 'Barbarian', choices: 'Intimidating Presence' },
            { level: 11, class: 'Barbarian', choices: 'Relentless Rage (não morre a 0 HP)' },
            { level: 12, class: 'Barbarian', choices: '⭐ Feat: Ability Improvement (+2 STR → 20)' },
        ],
        combo: [
            'Sempre Rage antes de atacar!',
            'Reckless Attack = vantagem em todo ataque',
            'Frenzy = 3 ataques por turno (desde Lv 3!)',
            'Com Soul Coin = dano de fogo extra!'
        ],
        equipment: [
            { name: 'Soul Coin', note: 'Dano de fogo extra (item exclusivo da Karlach)' },
            { name: 'Greataxe ou Maul', note: 'Arma de duas mãos para GWM' },
            { name: 'Amulet of Misty Step', note: 'Mobilidade extra' },
            { name: 'Bonespike Boots', note: 'Bonificação em combate' }
        ]
    },
    shadowheart: {
        id: 'shadowheart',
        name: 'Shadowheart',
        emoji: '✝️',
        role: 'Healer / Support',
        race: 'Half-Elf (High)',
        class: 'Cleric',
        subclass: 'Life Domain (respec)',
        description: 'Healer imortal e suporte. Spirit Guardians faz ela virar um helicóptero de dano radiant.',
        color: 'shadowheart',
        stats: {
            STR: 10, DEX: 10, CON: 14,
            INT: 10, WIS: 16, CHA: 14
        },
        fightingStyle: 'N/A (Cleric)',
        background: 'Acolyte (Insight + Religion)',
        keyAbilities: ['Disciple of Life', 'Channel Divinity', 'Spirit Guardians', 'Healing Word'],
        spells: ['Bless', 'Healing Word', 'Spiritual Weapon', 'Spirit Guardians', 'Mass Healing Word'],
        progression: [
            { level: 1, class: 'Cleric', choices: '⭐ Life Domain — Disciple of Life (cura extra)' },
            { level: 2, class: 'Cleric', choices: 'Channel Divinity: Preserve Life (cura em área massiva)' },
            { level: 3, class: 'Cleric', choices: 'Spells: Spiritual Weapon, Silence, Lesser Restoration' },
            { level: 4, class: 'Cleric', choices: '⭐ Feat: Ability Improvement (+2 WIS → 18)' },
            { level: 5, class: 'Cleric', choices: '⭐ Spirit Guardians (dano radiant em área — HELICÓPTERO 🚁)' },
            { level: 6, class: 'Cleric', choices: 'Blessed Healer, Channel Divinity extra' },
            { level: 7, class: 'Cleric', choices: 'Death Ward, Guardian of Faith' },
            { level: 8, class: 'Cleric', choices: '⭐ Feat: War Caster (manter concentração)' },
            { level: 9, class: 'Cleric', choices: 'Mass Cure Wounds, Greater Restoration' },
            { level: 10, class: 'Cleric', choices: 'Divine Intervention (uso único, efeito poderoso)' },
            { level: 11, class: 'Cleric', choices: 'Heal (cura massiva), Heroes\' Feast' },
            { level: 12, class: 'Cleric', choices: '⭐ Feat: Resilient (CON) ou +2 WIS → 20' },
        ],
        combo: [
            'Bless no início de cada combate (+1d4 em ataques e saves)',
            'Spirit Guardians + andar pelo campo = dano passivo massivo',
            'Healing Word como ação bônus (cura a distância)',
            'Spiritual Weapon = ataque bônus todo turno sem concentração'
        ],
        equipment: [
            { name: 'Blood of Lathander', note: 'Luz solar, cega undead, revive se morrer' },
            { name: 'Medium Armor', note: 'Bom AC sem perder mobilidade' },
            { name: 'Shield', note: '+2 AC' },
            { name: 'Amulet of Restoration', note: 'Cura extra' }
        ]
    }
};

// ===== Tips Data =====
const TIPS = [
    {
        emoji: '🎯',
        title: 'Combo de Surpresa',
        text: 'Sempre que possível, entre em stealth com Tav antes do combate. O combo Gloom Stalker + Assassin pode eliminar inimigos antes deles agirem.'
    },
    {
        emoji: '🛡️',
        title: 'Posicionamento',
        text: 'Mantenha Karlach e Lae\'zel na frente. Shadowheart no meio pra Spirit Guardians acertar mais inimigos. Tav atrás com arco.'
    },
    {
        emoji: '💊',
        title: 'Cura Preventiva',
        text: 'Use Bless antes do combate, não depois. O +1d4 em saves e ataques previne mais dano do que Healing Word cura.'
    },
    {
        emoji: '⚡',
        title: 'Action Economy',
        text: 'Action Surge no primeiro turno é melhor que guardar. Eliminar inimigos rápido = menos dano recebido no total.'
    },
    {
        emoji: '🔥',
        title: 'Rage Cedo',
        text: 'Karlach deve usar Rage no primeiro turno. Resistência a dano físico dura o combate todo e Frenzy dá ataque bônus.'
    },
    {
        emoji: '🌀',
        title: 'Spirit Guardians',
        text: 'Shadowheart com Spirit Guardians deve andar pelo campo de batalha, não ficar parada. Cada inimigo que entra no alcance toma dano radiant.'
    },
    {
        emoji: '💀',
        title: 'Prioridades de Alvo',
        text: 'Sempre mate: 1) Mages (dano alto), 2) Healers, 3) Archers, 4) Tanks. Inimigos com pouco HP são prioridade pra remover ações do campo.'
    },
    {
        emoji: '🎲',
        title: 'Reckless Attack',
        text: 'Karlach com Reckless Attack ganha vantagem mas os inimigos ganham vantagem contra ela. Use quando tiver Rage ativo pra reduzir o dano recebido.'
    }
];

// ===== Level-specific info =====
function getLevelSummary(level) {
    const summaries = {
        tav: {
            1: 'Ranger básico. Hunter\'s Mark é sua melhor spell.',
            2: 'Archery Fighting Style. +2 em todos os tiros!',
            3: '⭐ Gloom Stalker! Dread Ambusher = ataque extra no 1º turno.',
            4: '⭐ Sharpshooter! Dano massivo (-5 acerto, +10 dano).',
            5: 'Extra Attack. 2 tiros por turno + Dread Ambusher = 3 no 1º turno.',
            6: 'Multiclass Rogue. Sneak Attack 1d6.',
            7: 'Cunning Action. Hide como ação bônus = stealth infinito.',
            8: '⭐ Assassin! Crit garantido em inimigos surpresos.',
            9: '+2 DEX. Mais acerto e dano.',
            10: 'Evasion. Dano de area reduzido pela metade.',
            11: '⭐ Alert. +5 iniciativa, não pode ser surpreso.',
            12: 'Build completa. Máximo de dano no primeiro turno.',
        },
        laezel: {
            1: 'Fighter básico. Proficiência em todas armas.',
            2: '⭐ Action Surge! Turno dobrado.',
            3: '⭐ Battle Master! Riposte, Precision, Trip Attack.',
            4: '⭐ Great Weapon Master. Dano absurdo.',
            5: 'Extra Attack. 2 ataques por turno.',
            6: '+2 STR. Mais acerto e dano.',
            7: 'Maneuvers extras. Mais opções de controle.',
            8: '+2 STR → 20. STR máxima!',
            9: 'Indomitable. Rerrolar saves falhos.',
            10: 'Maneuvers melhoram (+d8 → +d10).',
            11: '⭐ Extra Attack (2). 3 ATAQUES POR TURNO!',
            12: 'Build completa. Máquina de matar.',
        },
        karlach: {
            1: '⭐ Rage! Dano extra e resistência.',
            2: '⭐ Reckless Attack. Vantagem garantida.',
            3: '⭐ Berserker! Frenzy = ataque bônus.',
            4: '⭐ Great Weapon Master. Dano massivo.',
            5: 'Extra Attack + Fast Movement. 2 ataques + mais rápido.',
            6: 'Mindless Rage. Imune a charm/frighten.',
            7: 'Feral Instinct. +3 iniciativa.',
            8: '+2 STR. Mais acerto e dano.',
            9: 'Brutal Critical. Críticos mais fortes.',
            10: 'Intimidating Presence. Utility.',
            11: 'Relentless Rage. Não morre a 0 HP!',
            12: '+2 STR → 20. Build completa.',
        },
        shadowheart: {
            1: '⭐ Life Domain. Cura extra em todas as curas.',
            2: '⭐ Preserve Life. Cura massiva em área.',
            3: 'Spiritual Weapon. Ataque bônus sem concentração.',
            4: '+2 WIS. Mais acerto e dano em spells.',
            5: '⭐ Spirit Guardians! HELICÓPTERO DE DANO RADIANT 🚁',
            6: 'Blessed Healer. Cura a si mesma quando cura outros.',
            7: 'Death Ward. Evita morte de um aliado.',
            8: '⭐ War Caster. Mantém concentração mais fácil.',
            9: 'Mass Cure Wounds. Cura em área.',
            10: 'Divine Intervention. Efeito poderoso único.',
            11: 'Heal. Cura massiva de 70 HP.',
            12: 'Build completa. Healer imortal.',
        }
    };
    return summaries[level];
}
