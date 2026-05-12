export const CONFIG = {
  worldWidth: 6400,
  worldHeight: 720,
  groundY: 535,
  laneY: 510,

  playerBaseX: 130,
  enemyBaseX: 6270,
  playerGateX: 880,
  enemyGateX: 5520,
  midTowerX: 3200,

  unitCap: 20,
  startGold: 90,
  goldPerSecond: 6,

  startLevel: 1,
  xpPerSecond: 1.9,
  xpFromUnitKill: 18,
  xpFromStructureDestroy: 120,
  levelXpBase: 90,
  levelXpGrowth: 45,

  aiXpPerSecond: 2.9,
  midCaptureRadius: 420,
  midCaptureSeconds: 5.5,
  midCaptureMinUnits: 4,

  gateArcherRange: 520,
  gateArcherDamage: 18,
  gateArcherAttackSeconds: 1.15,

  spawnCooldown: 0.35,
  waveEvery: 28,
  cameraFollowPadding: 250,

  imagePath: "assets/",
  useExternalAssets: true
};

export const TEAM = {
  PLAYER: "player",
  ENEMY: "enemy",
  NEUTRAL: "neutral"
};

export const ORDER = {
  ATTACK: "attack",
  DEFEND: "defend"
};
