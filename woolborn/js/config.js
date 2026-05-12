const SAVE_KEY = "woolborn_fixed_full_save";

const START_GAME = {
  scene: "menu",
  difficulty: "normal",
  player: {
    name: "Du",
    hp: 135,
    maxHp: 135,
    mana: 80,
    maxMana: 80,
    xp: 0,
    level: 1,
    classPath: null,
    subclass: null,
    faction: null,
    morality: 0,
    stats: {
      stealth: 0,
      wisdom: 0,
      courage: 0,
      leadership: 0
    },
    trust: {
      genz: 1,
      arcade: 1,
      dragon: 0
    },
    inventory: [],
    abilities: [],
    cooldowns: {},
    turn: 0,
    quests: [],
    completed: [],
    flags: {},
    companions: {
      genz: {
        name: "Genz-fåret",
        path: null,
        subclass: null
      },
      arcade: {
        name: "Arcadefåret",
        path: null,
        subclass: null
      }
    }
  },
  log: ["Nytt äventyr startade."]
};
const DIFFICULTY_SETTINGS = {
  easy: {
    label: "Easy",
    hp: 0.80,
    dc: -1,
    atk: -1,
    damage: -2,
    xp: 1.15
  },
  normal: {
    label: "Normal",
    hp: 1.00,
    dc: 0,
    atk: 0,
    damage: 0,
    xp: 1.00
  },
  hard: {
    label: "Hard",
    hp: 1.30,
    dc: 1,
    atk: 2,
    damage: 2,
    xp: 1.10
  },
  nightmare: {
    label: "Nightmare",
    hp: 1.65,
    dc: 2,
    atk: 3,
    damage: 4,
    xp: 1.25
  }
};


const CLASS_ABILITIES = {
  Assassin: [
    {
      id: "quick_slash",
      name: "Quick Slash",
      level: 1,
      mana: 0,
      cooldown: 0,
      stat: "stealth",
      bonus: 3,
      dice: 8,
      description: "Snabb dolkattack."
    },
    {
      id: "shadow_step",
      name: "Shadow Step",
      level: 2,
      mana: 8,
      cooldown: 1,
      stat: "stealth",
      bonus: 6,
      dice: 10,
      description: "Smygslag från skuggorna."
    },
    {
      id: "poison_blade",
      name: "Poison Blade",
      level: 4,
      mana: 14,
      cooldown: 2,
      stat: "stealth",
      bonus: 10,
      dice: 12,
      description: "Giftig attack med hög skada."
    },
    {
      id: "susano",
      name: "Susano",
      level: 7,
      mana: 32,
      cooldown: 4,
      stat: "stealth",
      bonus: 22,
      dice: 20,
      void: 1,
      description: "Förbjuden skuggrustning."
    }
  ],

  Mage: [
    {
      id: "mana_bolt",
      name: "Mana Bolt",
      level: 1,
      mana: 0,
      cooldown: 0,
      stat: "wisdom",
      bonus: 3,
      dice: 8,
      description: "Enkel manastråle."
    },
    {
      id: "elemental_burst",
      name: "Elemental Burst",
      level: 2,
      mana: 10,
      cooldown: 1,
      stat: "wisdom",
      bonus: 7,
      dice: 10,
      description: "Elementär magi."
    },
    {
      id: "arcane_shield",
      name: "Arcane Shield",
      level: 4,
      mana: 16,
      cooldown: 2,
      stat: "wisdom",
      bonus: 5,
      dice: 8,
      shield: 18,
      description: "Skadar lite och skyddar dig."
    },
    {
      id: "astral_rift",
      name: "Astral Rift",
      level: 7,
      mana: 34,
      cooldown: 4,
      stat: "wisdom",
      bonus: 24,
      dice: 20,
      description: "River upp verkligheten."
    }
  ],

  Shaolin: [
    {
      id: "palm_strike",
      name: "Palm Strike",
      level: 1,
      mana: 0,
      cooldown: 0,
      stat: "courage",
      bonus: 3,
      dice: 8,
      description: "Disciplinerad närstridsattack."
    },
    {
      id: "chi_burst",
      name: "Chi Burst",
      level: 2,
      mana: 8,
      cooldown: 1,
      stat: "courage",
      bonus: 6,
      dice: 10,
      description: "Explosiv chi-energi."
    },
    {
      id: "dragon_fist",
      name: "Dragon Fist",
      level: 4,
      mana: 14,
      cooldown: 2,
      stat: "courage",
      bonus: 11,
      dice: 12,
      description: "Drakens slag."
    },
    {
      id: "enlightened_form",
      name: "Enlightened Form",
      level: 7,
      mana: 30,
      cooldown: 4,
      stat: "courage",
      bonus: 20,
      dice: 18,
      shield: 22,
      description: "Shaolinens ultimata fokus."
    }
  ]
};
const enemies = {
  dragonYoung: {
    name: "Ung skuggdrake",
    maxHp: 34,
    hp: 34,
    dc: 10,
    atk: 2,
    die: 6,
    xp: 50,
    desc: "Draken från skogen. Inte ond, men livsfarlig."
  },

  shadowWarden: {
    name: "Skuggväktare",
    maxHp: 42,
    hp: 42,
    dc: 10,
    atk: 3,
    die: 6,
    xp: 65,
    desc: "En väktare som testar alla som vill läsa Susano-scrollen."
  },

  cloudImp: {
    name: "Molnimp",
    maxHp: 36,
    hp: 36,
    dc: 10,
    atk: 3,
    die: 6,
    xp: 60,
    desc: "En retlig varelse som stjäl mana från molnöarna."
  },

  woolkong: {
    name: "EP-fåret Woolkong",
    maxHp: 55,
    hp: 55,
    dc: 11,
    atk: 4,
    die: 8,
    xp: 80,
    desc: "Shaolinbergets legendariska träningsboss."
  },

  ironScout: {
    name: "Ironhoof Spejare",
    maxHp: 45,
    hp: 45,
    dc: 11,
    atk: 4,
    die: 8,
    xp: 70,
    desc: "En mekanisk spejare från Ironhoof."
  },

  stormPriest: {
    name: "Stormflock Präst",
    maxHp: 48,
    hp: 48,
    dc: 11,
    atk: 4,
    die: 8,
    xp: 75,
    desc: "En åskdyrkare med mörk stormmagi."
  },

  castlehorn: {
    name: "Castlehorn",
    maxHp: 80,
    hp: 80,
    dc: 12,
    atk: 6,
    die: 10,
    xp: 120,
    desc: "Ironhoofs största får, förstärkt av CastleCastle-frukten."
  },

  voltshade: {
    name: "Voltshade",
    maxHp: 76,
    hp: 76,
    dc: 12,
    atk: 6,
    die: 10,
    xp: 120,
    desc: "Stormflocks mörker-blixt shaman."
  },

  voidDragon1: {
    name: "Void Dragon Fas 1",
    maxHp: 90,
    hp: 90,
    dc: 12,
    atk: 7,
    die: 10,
    xp: 150,
    desc: "Draken skyddar kraterhjärtat och testar er."
  },

  voidDragon2: {
    name: "Void Dragon Fas 2",
    maxHp: 110,
    hp: 110,
    dc: 13,
    atk: 8,
    die: 12,
    xp: 220,
    desc: "Draken öppnar sina voidvingar. Himlen spricker."
  },

  voidSelf: {
    name: "Din Void-skugga",
    maxHp: 85,
    hp: 85,
    dc: 13,
    atk: 7,
    die: 10,
    xp: 180,
    desc: "En version av dig som vill ta kraterhjärtat."
  }
};
