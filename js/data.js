// ===== BG3 Party Builder - Dados =====

const CHARACTERS = {
    tav: {
        id: 'tav',
        name: 'Tav',
        emoji: '🏹',
        role: 'DPS à Distância',
        race: 'Meio-Elfo Silvestre',
        class: 'Ranger / Rogue',
        subclass: 'Gloom Stalker / Assassin',
        description: 'O melhor arqueiro do jogo. Dano absurdo no primeiro turno com combinação de furtividade e acertos críticos.',
        color: 'tav',
        stats: {
            FOR: 10, DES: 16, CON: 14,
            INT: 8, SAB: 14, CAR: 12
        },
        fightingStyle: 'Arquearia (+2 acerto com arco)',
        background: 'Pivete (Furtividade + Prestidigitação)',
        keyAbilities: ['Emboscar Sombrio', 'Ataque Furtivo', 'Assassinar', 'Atirador Perfeito'],
        spells: ['Marca do Caçador', 'Golpe Enredante', 'Disfarce'],
        progression: [
            { level: 1, class: 'Ranger', choices: 'Inimigo Favorito: Caçador de Recompensas, Explorador Natural: Urbano' },
            { level: 2, class: 'Ranger', choices: 'Estilo de Luta: Arquearia, Magias: Marca do Caçador + Golpe Enredante' },
            { level: 3, class: 'Ranger', choices: '⭐ Gloom Stalker — Emboscar Sombrio (ataque extra no 1º turno!)' },
            { level: 4, class: 'Ranger', choices: '⭐ Talento: Atirador Perfeito (-5 acerto, +10 dano)' },
            { level: 5, class: 'Ranger', choices: 'Ataque Extra (2 ataques por turno)' },
            { level: 6, class: 'Rogue', choices: 'Ataque Furtivo 1d6' },
            { level: 7, class: 'Rogue', choices: 'Ação Ardilosa (Investida/Furtividade como ação bônus)' },
            { level: 8, class: 'Rogue', choices: '⭐ Assassino — Crítico garantido em inimigos surpresos!' },
            { level: 9, class: 'Rogue', choices: '⭐ Talento: Melhoria de Atributo (+2 DES → 18)' },
            { level: 10, class: 'Rogue', choices: 'Evasão, Ataque Furtivo 2d6' },
            { level: 11, class: 'Rogue', choices: '⭐ Talento: Alerta (+5 iniciativa, não pode ser surpreso)' },
            { level: 12, class: 'Rogue', choices: 'Talento Confiável, Ataque Furtivo 3d6' },
        ],
        combo: [
            'Sempre entre em furtividade antes do combate',
            'Atire com Surpresa (inimigo surpreso)',
            '1º turno: 2 ataques + Emboscar Sombrio (1 extra) + crítico de Assassino',
            'Dano: ~60-100+ no primeiro turno! 💀'
        ],
        equipment: [
            { name: 'Arco Titanstring', note: 'Adiciona FOR ao dano' },
            { name: 'Armadura Média', note: 'Modificador de DES conta para CA' },
            { name: 'Vingança da Prole', note: 'Dano extra de veneno' },
            { name: 'Bulbo Cáustico', note: 'Consumível, dano de ácido em área' }
        ]
    },
    laezel: {
        id: 'laezel',
        name: 'Lae\'zel',
        emoji: '⚔️',
        role: 'DPS Corpo a Corpo',
        race: 'Githyanki',
        class: 'Guerreiro',
        subclass: 'Mestre de Batalha',
        description: 'Tanque/DPS corpo a corpo que dá dano alto e controla o campo com manobras. 3 ataques por turno no nível 11.',
        color: 'laezel',
        stats: {
            FOR: 17, DES: 13, CON: 15,
            INT: 10, SAB: 12, CAR: 8
        },
        fightingStyle: 'Combate com Arma de Duas Mãos',
        background: 'Soldado (Atletismo + Intimidação)',
        keyAbilities: ['Surto de Ação', 'Ripostar', 'Ataque de Precisão', 'Ataque Derrubador'],
        spells: [],
        progression: [
            { level: 1, class: 'Guerreiro', choices: 'Estilo de Luta: Combate com Arma de Duas Mãos' },
            { level: 2, class: 'Guerreiro', choices: 'Surto de Ação (turno dobrado!)' },
            { level: 3, class: 'Guerreiro', choices: '⭐ Mestre de Batalha — Manobras: Ripostar, Precisão, Ataque Derrubador' },
            { level: 4, class: 'Guerreiro', choices: '⭐ Talento: Mestre de Arma de Duas Mãos (-5 acerto, +10 dano)' },
            { level: 5, class: 'Guerreiro', choices: 'Ataque Extra (2 ataques por turno)' },
            { level: 6, class: 'Guerreiro', choices: '⭐ Talento: Melhoria de Atributo (+2 FOR → 18)' },
            { level: 7, class: 'Guerreiro', choices: 'Manobras extras: Ataque Amedrontador, Desarmar' },
            { level: 8, class: 'Guerreiro', choices: '⭐ Talento: Melhoria de Atributo (+2 FOR → 20)' },
            { level: 9, class: 'Guerreiro', choices: 'Indomável (re-rolar falhas)' },
            { level: 10, class: 'Guerreiro', choices: 'Manobras melhoram (+d8 → +d10)' },
            { level: 11, class: 'Guerreiro', choices: '⭐ Ataque Extra (2) — 3 ATAQUES POR TURNO!' },
            { level: 12, class: 'Guerreiro', choices: '⭐ Talento: Atacante Selvagem ou Alerta' },
        ],
        combo: [
            'Psionics Githyanki: Salto + Passo Nebuloso para alcançar inimigos',
            'Surto de Ação = turno dobrado (6 ataques no Lv 11!)',
            'Ataque Derrubador derruba o inimigo, ganha vantagem nos próximos',
            'Mestre de Arma de Duas Mãos com vantagem = dano massivo'
        ],
        equipment: [
            { name: 'Espada de Prata do Plano Astral', note: 'Espada lendária githyanki' },
            { name: 'Armadura Pesada (Placas)', note: 'CA máxima' },
            { name: 'Armadura Média Githyanki', note: 'Bônus raciais' },
            { name: 'Luvas do Poder', note: 'Dano extra desarmado' }
        ]
    },
    karlach: {
        id: 'karlach',
        name: 'Karlach',
        emoji: '🔥',
        role: 'Tanque / DPS',
        race: 'Tiefling de Zariel',
        class: 'Bárbaro',
        subclass: 'Berserker',
        description: 'Dano bruto e resistência. Ela bate forte e não morre. Fúria + Frenesi = destruição.',
        color: 'karlach',
        stats: {
            FOR: 16, DES: 14, CON: 16,
            INT: 8, SAB: 10, CAR: 12
        },
        fightingStyle: 'N/A (Bárbaro)',
        background: 'Andarilho (Atletismo + Sobrevivência)',
        keyAbilities: ['Fúria', 'Ataque Temerário', 'Frenesi', 'Crítico Brutal'],
        spells: [],
        progression: [
            { level: 1, class: 'Bárbaro', choices: 'Fúria (dano extra + resistência a dano físico)' },
            { level: 2, class: 'Bárbaro', choices: 'Ataque Temerário (vantagem garantida!)' },
            { level: 3, class: 'Bárbaro', choices: '⭐ Berserker — Frenesi (ataque bônus extra)' },
            { level: 4, class: 'Bárbaro', choices: '⭐ Talento: Mestre de Arma de Duas Mãos (-5 acerto, +10 dano)' },
            { level: 5, class: 'Bárbaro', choices: 'Ataque Extra, Movimento Rápido (+3m)' },
            { level: 6, class: 'Bárbaro', choices: 'Fúria Cega (imune a encanto/medo)' },
            { level: 7, class: 'Bárbaro', choices: 'Instinto Selvagem (+3 iniciativa)' },
            { level: 8, class: 'Bárbaro', choices: '⭐ Talento: Melhoria de Atributo (+2 FOR → 18)' },
            { level: 9, class: 'Bárbaro', choices: 'Crítico Brutal (+1 dado de dano crítico)' },
            { level: 10, class: 'Bárbaro', choices: 'Presença Intimidadora' },
            { level: 11, class: 'Bárbaro', choices: 'Fúria Implacável (não morre a 0 PV)' },
            { level: 12, class: 'Bárbaro', choices: '⭐ Talento: Melhoria de Atributo (+2 FOR → 20)' },
        ],
        combo: [
            'Sempre Fúria antes de atacar!',
            'Ataque Temerário = vantagem em todo ataque',
            'Frenesi = 3 ataques por turno (desde Lv 3!)',
            'Com Moeda da Alma = dano de fogo extra!'
        ],
        equipment: [
            { name: 'Moeda da Alma', note: 'Dano de fogo extra (item exclusivo da Karlach)' },
            { name: 'Machado Grande ou Malho', note: 'Arma de duas mãos para Mestre de Arma' },
            { name: 'Amuleto de Passo Nebuloso', note: 'Mobilidade extra' },
            { name: 'Botas Ósseas', note: 'Bônus em combate' }
        ]
    },
    shadowheart: {
        id: 'shadowheart',
        name: 'Shadowheart',
        emoji: '✝️',
        role: 'Curandeira / Suporte',
        race: 'Meio-Elfa (Alta)',
        class: 'Clériga',
        subclass: 'Domínio da Vida (respec)',
        description: 'Curandeira imortal e suporte. Guardiões Espirituais faz ela virar um helicóptero de dano radiante.',
        color: 'shadowheart',
        stats: {
            FOR: 10, DES: 10, CON: 14,
            INT: 10, SAB: 16, CAR: 14
        },
        fightingStyle: 'N/A (Clériga)',
        background: 'Acólita (Intuição + Religião)',
        keyAbilities: ['Discípula da Vida', 'Canalizar Divindade', 'Guardiões Espirituais', 'Palavra de Cura'],
        spells: ['Bênção', 'Palavra de Cura', 'Arma Espiritual', 'Guardiões Espirituais', 'Palavra de Cura em Massa'],
        progression: [
            { level: 1, class: 'Clériga', choices: '⭐ Domínio da Vida — Discípula da Vida (cura extra)' },
            { level: 2, class: 'Clériga', choices: 'Canalizar Divindade: Preservar Vida (cura em área massiva)' },
            { level: 3, class: 'Clériga', choices: 'Magias: Arma Espiritual, Silêncio, Restauração Menor' },
            { level: 4, class: 'Clériga', choices: '⭐ Talento: Melhoria de Atributo (+2 SAB → 18)' },
            { level: 5, class: 'Clériga', choices: '⭐ Guardiões Espirituais (dano radiante em área — HELICÓPTERO 🚁)' },
            { level: 6, class: 'Clériga', choices: 'Curandeira Abençoada, Canalizar Divindade extra' },
            { level: 7, class: 'Clériga', choices: 'Sentinela da Morte, Guardião da Fé' },
            { level: 8, class: 'Clériga', choices: '⭐ Talento: Conjurador de Guerra (manter concentração)' },
            { level: 9, class: 'Clériga', choices: 'Cura de Ferimentos em Massa, Restauração Maior' },
            { level: 10, class: 'Clériga', choices: 'Intervenção Divina (uso único, efeito poderoso)' },
            { level: 11, class: 'Clériga', choices: 'Curar (cura massiva), Banquete dos Heróis' },
            { level: 12, class: 'Clériga', choices: '⭐ Talento: Resiliente (CON) ou +2 SAB → 20' },
        ],
        combo: [
            'Bênção no início de cada combate (+1d4 em ataques e salvamentos)',
            'Guardiões Espirituais + andar pelo campo = dano passivo massivo',
            'Palavra de Cura como ação bônus (cura à distância)',
            'Arma Espiritual = ataque bônus todo turno sem concentração'
        ],
        equipment: [
            { name: 'Sangue de Lathander', note: 'Luz solar, cega mortos-vivos, revive se morrer' },
            { name: 'Armadura Média', note: 'Boa CA sem perder mobilidade' },
            { name: 'Escudo', note: '+2 CA' },
            { name: 'Amuleto de Restauração', note: 'Cura extra' }
        ]
    }
};

// ===== Dicas de Combate =====
const TIPS = [
    {
        emoji: '🎯',
        title: 'Combo de Surpresa',
        text: 'Sempre que possível, entre em furtividade com Tav antes do combate. O combo Gloom Stalker + Assassino pode eliminar inimigos antes deles agirem.'
    },
    {
        emoji: '🛡️',
        title: 'Posicionamento',
        text: 'Mantenha Karlach e Lae\'zel na frente. Shadowheart no meio para Guardiões Espirituais acertar mais inimigos. Tav atrás com arco.'
    },
    {
        emoji: '💊',
        title: 'Cura Preventiva',
        text: 'Use Bênção antes do combate, não depois. O +1d4 em salvamentos e ataques previne mais dano do que Palavra de Cura cura.'
    },
    {
        emoji: '⚡',
        title: 'Economia de Ação',
        text: 'Surto de Ação no primeiro turno é melhor que guardar. Eliminar inimigos rápido = menos dano recebido no total.'
    },
    {
        emoji: '🔥',
        title: 'Fúria Cedo',
        text: 'Karlach deve usar Fúria no primeiro turno. Resistência a dano físico dura o combate todo e Frenesi dá ataque bônus.'
    },
    {
        emoji: '🌀',
        title: 'Guardiões Espirituais',
        text: 'Shadowheart com Guardiões Espirituais deve andar pelo campo de batalha, não ficar parada. Cada inimigo que entra no alcance toma dano radiante.'
    },
    {
        emoji: '💀',
        title: 'Prioridades de Alvo',
        text: 'Sempre mate: 1) Magos (dano alto), 2) Curandeiros, 3) Arqueiros, 4) Tanques. Inimigos com pouco PV são prioridade para remover ações do campo.'
    },
    {
        emoji: '🎲',
        title: 'Ataque Temerário',
        text: 'Karlach com Ataque Temerário ganha vantagem mas os inimigos ganham vantagem contra ela. Use quando tiver Fúria ativa para reduzir o dano recebido.'
    }
];

// ===== Resumo por Nível =====
function getLevelSummary(level) {
    const summaries = {
        tav: {
            1: 'Ranger básico. Marca do Caçador é sua melhor magia.',
            2: 'Estilo de Luta: Arquearia. +2 em todos os tiros!',
            3: '⭐ Gloom Stalker! Emboscar Sombrio = ataque extra no 1º turno.',
            4: '⭐ Atirador Perfeito! Dano massivo (-5 acerto, +10 dano).',
            5: 'Ataque Extra. 2 tiros por turno + Emboscar Sombrio = 3 no 1º turno.',
            6: 'Multiclasse Rogue. Ataque Furtivo 1d6.',
            7: 'Ação Ardilosa. Furtividade como ação bônus = stealth infinito.',
            8: '⭐ Assassino! Crítico garantido em inimigos surpresos.',
            9: '+2 DES. Mais acerto e dano.',
            10: 'Evasão. Dano de área reduzido pela metade.',
            11: '⭐ Alerta. +5 iniciativa, não pode ser surpreso.',
            12: 'Build completa. Máximo de dano no primeiro turno.',
        },
        laezel: {
            1: 'Guerreira básica. Proficiência em todas armas.',
            2: '⭐ Surto de Ação! Turno dobrado.',
            3: '⭐ Mestre de Batalha! Ripostar, Precisão, Ataque Derrubador.',
            4: '⭐ Mestre de Arma de Duas Mãos. Dano absurdo.',
            5: 'Ataque Extra. 2 ataques por turno.',
            6: '+2 FOR. Mais acerto e dano.',
            7: 'Manobras extras. Mais opções de controle.',
            8: '+2 FOR → 20. FOR máxima!',
            9: 'Indomável. Re-rolar falhas em salvamentos.',
            10: 'Manobras melhoram (+d8 → +d10).',
            11: '⭐ Ataque Extra (2). 3 ATAQUES POR TURNO!',
            12: 'Build completa. Máquina de matar.',
        },
        karlach: {
            1: '⭐ Fúria! Dano extra e resistência.',
            2: '⭐ Ataque Temerário. Vantagem garantida.',
            3: '⭐ Berserker! Frenesi = ataque bônus.',
            4: '⭐ Mestre de Arma de Duas Mãos. Dano massivo.',
            5: 'Ataque Extra + Movimento Rápido. 2 ataques + mais rápido.',
            6: 'Fúria Cega. Imune a encanto/medo.',
            7: 'Instinto Selvagem. +3 iniciativa.',
            8: '+2 FOR. Mais acerto e dano.',
            9: 'Crítico Brutal. Críticos mais fortes.',
            10: 'Presença Intimidadora. Utilidade.',
            11: 'Fúria Implacável. Não morre a 0 PV!',
            12: '+2 FOR → 20. Build completa.',
        },
        shadowheart: {
            1: '⭐ Domínio da Vida. Cura extra em todas as curas.',
            2: '⭐ Preservar Vida. Cura massiva em área.',
            3: 'Arma Espiritual. Ataque bônus sem concentração.',
            4: '+2 SAB. Mais acerto e dano em magias.',
            5: '⭐ Guardiões Espirituais! HELICÓPTERO DE DANO RADIANTE 🚁',
            6: 'Curandeira Abençoada. Cura a si mesma quando cura outros.',
            7: 'Sentinela da Morte. Evita morte de um aliado.',
            8: '⭐ Conjurador de Guerra. Mantém concentração mais fácil.',
            9: 'Cura de Ferimentos em Massa. Cura em área.',
            10: 'Intervenção Divina. Efeito poderoso único.',
            11: 'Curar. Cura massiva de 70 PV.',
            12: 'Build completa. Curandeira imortal.',
        }
    };
    return summaries[level];
}
