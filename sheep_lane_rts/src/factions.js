export const FACTIONS = {
  standard: {
    name: "Standard",
    color: "#f8fafc",
    units: [
      { key:"standardsword1", name:"Sword", role:"melee", cost:45, hp:120, dmg:16, range:58, speed:76, atk:0.75, armor:0, size:90 },
      { key:"standardarcher2", name:"Archer", role:"ranged", cost:65, hp:75, dmg:15, range:260, speed:62, atk:0.95, armor:0, size:85, projectile:"arrow" },
      { key:"standardtank3", name:"Tank", role:"tank", cost:110, hp:260, dmg:18, range:55, speed:38, atk:1.1, armor:7, size:110 },
      { key:"standardhealer4", name:"Healer", role:"support", cost:80, hp:85, dmg:0, heal:15, range:220, speed:56, atk:1.0, armor:0, size:88 }
    ]
  },

  shadow: {
    name: "Shadow",
    color: "#a78bfa",
    units: [
      { key:"shadowsword1", name:"Assasin", role:"melee", cost:55, hp:95, dmg:25, range:60, speed:112, atk:0.55, armor:0, size:85, burst:true },
      { key:"shadowarcher2", name:"Shuriken", role:"ranged", cost:75, hp:65, dmg:20, range:230, speed:96, atk:0.7, armor:0, size:85, projectile:"kunai" },
      { key:"susanoBoss", name:"Susano", role:"boss", cost:260, hp:420, dmg:42, range:92, speed:58, atk:1.2, armor:5, size:145, ability:"susano" },
    ]
  },

  arcane: {
    name: "Arcane",
    color: "#38bdf8",
    units: [
      { key:"arcanesword1", name:"Arcane", role:"ranged", cost:55, hp:105, dmg:15, range:55, speed:68, atk:0.8, armor:1, size:88 },
      { key:"arcanearcher2", name:"Fire", role:"ranged", cost:80, hp:70, dmg:18, range:300, speed:60, atk:0.9, armor:0, size:88, projectile:"orb" },
      { key:"stormMageBoss", name:"Storm Mage", role:"boss", cost:280, hp:340, dmg:34, range:330, speed:48, atk:1.35, armor:2, size:140, projectile:"orb", ability:"storm" },
    ]
  },

  shaolin: {
    name: "Shaolin",
    color: "#fbbf24",
    units: [
      { key:"staffmonk1", name:"Staff", role:"melee", cost:55, hp:120, dmg:14, range:70, speed:72, atk:0.75, armor:1, size:90, stun:0.25 },
      { key:"flutemonk2", name:"Flute", role:"support", cost:85, hp:80, dmg:6, heal:8, range:240, speed:62, atk:0.9, armor:0, size:90, buff:true },
      { key:"woolkong3", name:"Woolkong", role:"boss", cost:270, hp:390, dmg:25, range:105, speed:70, atk:1.15, armor:3, size:150, ability:"cyclone" },
      { key:"shaolinhealer4", name:"Zen", role:"support", cost:90, hp:90, dmg:0, heal:16, range:215, speed:58, atk:1.0, armor:0, size:58 }
    ]
  },

  ironhoof: {
    name: "Ironhoof",
    color: "#94a3b8",
    units: [
      { key:"ironhoof1", name:"Shield", role:"melee", cost:60, hp:170, dmg:12, range:55, speed:42, atk:0.95, armor:7, size:68 },
      { key:"ironhoof2", name:"Ballista", role:"ranged", cost:90, hp:105, dmg:26, range:270, speed:36, atk:1.35, armor:3, size:66, projectile:"bolt" },
      { key:"fortressBoss", name:"Fortress", role:"boss", cost:300, hp:620, dmg:36, range:70, speed:24, atk:1.4, armor:12, size:125, auraArmor:3 },
      { key:"ironhoofhealer4", name:"Smith", role:"support", cost:95, hp:120, dmg:0, heal:12, range:205, speed:36, atk:1.1, armor:4, size:62 }
    ]
  },

  stormflock: {
    name: "Stormflock",
    color: "#60a5fa",
    units: [
      { key:"stormflock1", name:"Spark", role:"melee", cost:55, hp:90, dmg:19, range:58, speed:100, atk:0.62, armor:0, size:85, chain:1 },
      { key:"stormflock2", name:"Bolt", role:"ranged", cost:85, hp:68, dmg:24, range:280, speed:84, atk:0.95, armor:0, size:85, projectile:"lightning", chain:2 },
      { key:"thunderBoss", name:"Thunder", role:"boss", cost:285, hp:360, dmg:38, range:260, speed:76, atk:1.0, armor:2, size:150, ability:"lightningStorm" },
      { key:"stormflockhealer4", name:"Static", role:"support", cost:90, hp:72, dmg:8, heal:11, range:210, speed:82, atk:0.8, armor:0, size:58 }
    ]
  }
};
