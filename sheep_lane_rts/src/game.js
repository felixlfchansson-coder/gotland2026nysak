import { CONFIG, TEAM, ORDER } from "./config.js";
import { FACTIONS } from "./factions.js";
import { Unit, Structure, Effect, Projectile } from "./entities.js";
import { markShaolinHardWin } from "../../scripts/cosmetics.js";

const DIFFICULTY = {
  easy:   { enemySpawnMult: 1.35, aiXpMult: 1.05, enemyGoldMult: 0.85 },
  normal: { enemySpawnMult: 1.0,  aiXpMult: 1.35, enemyGoldMult: 1.0 },
  hard:   { enemySpawnMult: 0.72, aiXpMult: 1.75, enemyGoldMult: 1.15 }
};

export class Game {
  constructor() {
    this.started = false;
    this.difficultyKey = "normal";
    this.difficulty = DIFFICULTY.normal;

    this.gold = CONFIG.startGold;
    this.enemyGold = CONFIG.startGold;
    this.level = CONFIG.startLevel;
    this.aiLevel = CONFIG.startLevel;
    this.xp = 0;
    this.aiXp = 0;

    this.wave = 1;
    this.order = ORDER.DEFEND;
    this.factionKey = "standard";

    this.availableFactions = ["standard"];
    this.aiAvailableFactions = ["standard"];
    this.aiFactionKey = "standard";

    this.factionChoicePending = false;
    this.factionChoiceOffered = false;
    this.factionChoiceOptions = ["arcane", "shadow", "shaolin"];

    this.aiFactionChoiceOffered = false;
    this.aiFactionChoiceOptions = ["ironhoof", "stormflock"];

    this.midOwner = TEAM.NEUTRAL;
    this.midCaptureTeam = null;
    this.midCaptureProgress = 0;

    this.units = [];
    this.projectiles = [];
    this.effects = [];
    this.structures = [];
    this.gateArchers = [];
    this.spawnTimer = 0;
    this.enemySpawnTimer = 2;
    this.waveTimer = CONFIG.waveEvery;
    this.cameraX = 0;
    this.gameOver = false;

    this.initStructures();
    this.initGateArchers();
    this.spawnWolfsheep();
  }

  start(difficultyKey = "normal") {
    this.difficultyKey = difficultyKey;
    this.difficulty = DIFFICULTY[difficultyKey] || DIFFICULTY.normal;
    this.started = true;
  }

  initStructures() {
    this.structures = [
      new Structure({key:"playerBase", team:TEAM.PLAYER, x:CONFIG.playerBaseX, y:390, w:210, h:210, hp:1500}),
      new Structure({key:"enemyBase", team:TEAM.ENEMY, x:CONFIG.enemyBaseX, y:390, w:210, h:210, hp:1500}),
      new Structure({key:"blueGate", team:TEAM.PLAYER, x:CONFIG.playerGateX, y:405, w:110, h:180, hp:650}),
      new Structure({key:"redGate", team:TEAM.ENEMY, x:CONFIG.enemyGateX, y:405, w:110, h:180, hp:650}),
      new Structure({key:"midTower", team:TEAM.NEUTRAL, x:CONFIG.midTowerX, y:350, w:130, h:220, hp:900, maxHp:900})
    ];
  }

  initGateArchers() {
  this.gateArchers = [
    { team: TEAM.PLAYER, x: CONFIG.playerGateX - 55, y: CONFIG.laneY - 135, timer: 0.00, key: "standardarcher2" },
    { team: TEAM.PLAYER, x: CONFIG.playerGateX + 35, y: CONFIG.laneY - 135, timer: 0.55, key: "standardarcher2" },
    { team: TEAM.ENEMY, x: CONFIG.enemyGateX + 55, y: CONFIG.laneY - 135, timer: 0.00, key: "standardarcher2" },
    { team: TEAM.ENEMY, x: CONFIG.enemyGateX - 35, y: CONFIG.laneY - 135, timer: 0.55, key: "standardarcher2" }
  ];
}

  spawnWolfsheep() {
    if (this.midOwner !== TEAM.NEUTRAL) return;
    const max = 3 + Math.floor((this.wave - 1) / 3);
    const existing = this.units.filter(u => u.team === TEAM.NEUTRAL).length;
    for (let i = existing; i < max; i++) {
      const u = new Unit({
        team: TEAM.NEUTRAL,
        x: CONFIG.midTowerX + (i % 2 === 0 ? -95 - i * 14 : 95 + i * 14),
        faction: "neutral",
        def: {
            key:"wolfsheep",
            name:"Wolfsheep",
            role:"guard",
            hp:80 + this.wave * 5,
            dmg:8 + this.wave,
            range:60,
            speed:0,
            atk:1.35,
            armor:0,
            size:90
          }
      });
      u.order = ORDER.DEFEND;
      this.units.push(u);
    }
  }

  setFaction(key) {
    if (FACTIONS[key] && this.availableFactions.includes(key)) this.factionKey = key;
  }

  chooseExtraFaction(key) {
    if (!this.factionChoicePending) return false;
    if (!this.factionChoiceOptions.includes(key)) return false;
    this.availableFactions = ["standard", key];
    this.factionKey = key;
    this.factionChoicePending = false;
    return true;
  }

  chooseAiFaction() {
    if (this.aiFactionChoiceOffered) return;
    this.aiFactionChoiceOffered = true;
    const key = this.aiFactionChoiceOptions[Math.floor(Math.random() * this.aiFactionChoiceOptions.length)];
    this.aiAvailableFactions = ["standard", key];
    this.aiFactionKey = key;
  }

  xpNeededForNextLevel(level = this.level) {
    return CONFIG.levelXpBase + (level - 1) * CONFIG.levelXpGrowth;
  }

  addXp(amount, team = TEAM.PLAYER) {
    if (this.gameOver) return;
    if (team === TEAM.ENEMY) {
      this.aiXp += amount * this.difficulty.aiXpMult;
      while (this.aiXp >= this.xpNeededForNextLevel(this.aiLevel)) {
        this.aiXp -= this.xpNeededForNextLevel(this.aiLevel);
        this.aiLevel++;
        if (this.aiLevel >= 7) this.chooseAiFaction();
      }
      return;
    }

    this.xp += amount;
    while (this.xp >= this.xpNeededForNextLevel(this.level)) {
      this.xp -= this.xpNeededForNextLevel(this.level);
      this.level++;
      this.effects.push(new Effect("levelup", this.cameraX + 640, 250, 1.2));
      if (this.level >= 7 && !this.factionChoiceOffered) {
        this.factionChoiceOffered = true;
        this.factionChoicePending = true;
        this.order = ORDER.DEFEND;
        for (const u of this.units) if (u.team === TEAM.PLAYER) u.order = ORDER.DEFEND;
      }
    }
  }

  getLevelForTeam(team) {
    return team === TEAM.ENEMY ? this.aiLevel : this.level;
  }

  getUnitUnlockLevel(factionKey, unitIndex) {
    if (factionKey === "standard") return [1, 2, 3, 5][unitIndex] ?? 99;
    return [7, 8, 9, 11][unitIndex] ?? 99;
  }

  isUnitUnlocked(factionKey, unitIndex, team = TEAM.PLAYER) {
    return this.getLevelForTeam(team) >= this.getUnitUnlockLevel(factionKey, unitIndex);
  }

  spawnPlayerUnit(index) {
    if (!this.started || this.gameOver || this.spawnTimer > 0 || this.factionChoicePending) return false;
    if (!this.availableFactions.includes(this.factionKey)) return false;
    if (!this.isUnitUnlocked(this.factionKey, index, TEAM.PLAYER)) return false;
    if (this.units.filter(u => u.team === TEAM.PLAYER).length >= CONFIG.unitCap) return false;
    const def = FACTIONS[this.factionKey].units[index];
    if (!def || this.gold < def.cost) return false;
    this.gold -= def.cost;
    const u = new Unit({team:TEAM.PLAYER, x:CONFIG.playerBaseX + 145, def, faction:this.factionKey});
    u.order = this.order;
    this.units.push(u);
    this.spawnTimer = CONFIG.spawnCooldown;
    return true;
  }

  spawnEnemyUnit() {
    if (!this.started) return;
    const possibleFactions = this.aiAvailableFactions.filter(k => FACTIONS[k]);
    const faction = possibleFactions[Math.floor(Math.random() * possibleFactions.length)] || "standard";
    const list = FACTIONS[faction].units;
    const unlocked = list
      .map((def, i) => ({def, i}))
      .filter(x => this.isUnitUnlocked(faction, x.i, TEAM.ENEMY) && x.def.cost <= this.enemyGold);
    if (!unlocked.length) return;

    const pick = unlocked[Math.floor(Math.random() * unlocked.length)];
    this.enemyGold -= pick.def.cost;
    const u = new Unit({team:TEAM.ENEMY, x:CONFIG.enemyBaseX - 145, def:pick.def, faction});
    u.order = ORDER.ATTACK;
    this.units.push(u);
  }

  update(dt) {
    if (!this.started || this.gameOver) return;
    this.gold += CONFIG.goldPerSecond * dt;
    this.enemyGold += CONFIG.goldPerSecond * this.difficulty.enemyGoldMult * dt;
    this.addXp(CONFIG.xpPerSecond * dt, TEAM.PLAYER);
    this.addXp(CONFIG.aiXpPerSecond * dt, TEAM.ENEMY);
    this.spawnTimer = Math.max(0, this.spawnTimer - dt);

    this.waveTimer -= dt;
    if (this.waveTimer <= 0) {
      this.wave++;
      this.waveTimer = CONFIG.waveEvery;
      this.spawnWolfsheep();
    }

    this.enemySpawnTimer -= dt;
    if (this.enemySpawnTimer <= 0 && !this.factionChoicePending) {
      this.spawnEnemyUnit();
      const baseDelay = Math.max(0.9, 3.2 - this.wave * 0.12);
      this.enemySpawnTimer = baseDelay * this.difficulty.enemySpawnMult;
    }

    this.updateUnits(dt);
    this.updateGateArchers(dt);
    this.updateProjectiles(dt);
    this.updateMidCapture(dt);
    this.effects = this.effects.filter(e => (e.life -= dt) > 0);
    this.cleanup();
    this.updateCamera(dt);
    this.checkWinLose();
  }

  updateMidCapture(dt) {
    if (this.midOwner !== TEAM.NEUTRAL) return;

    const r = CONFIG.midCaptureRadius;

    const playerCount = this.units.filter(u =>
      u.team === TEAM.PLAYER &&
      !u.dead &&
      Math.abs(u.x - CONFIG.midTowerX) < r
    ).length;

    const enemyCount = this.units.filter(u =>
      u.team === TEAM.ENEMY &&
      !u.dead &&
      Math.abs(u.x - CONFIG.midTowerX) < r
    ).length;

    const neutralCount = this.units.filter(u =>
      u.team === TEAM.NEUTRAL &&
      !u.dead &&
      Math.abs(u.x - CONFIG.midTowerX) < r
    ).length;

    let dominant = null;

    // Man måste först döda wolfsheep i capture-zonen.
    // Sedan räcker 4 units och minst lika många som motståndaren.
    if (neutralCount === 0 && playerCount >= CONFIG.midCaptureMinUnits && playerCount >= enemyCount) {
      dominant = TEAM.PLAYER;
    }

    if (neutralCount === 0 && enemyCount >= CONFIG.midCaptureMinUnits && enemyCount > playerCount) {
      dominant = TEAM.ENEMY;
    }

    if (!dominant) {
      this.midCaptureProgress = Math.max(0, this.midCaptureProgress - dt * 0.55);
      if (this.midCaptureProgress <= 0) this.midCaptureTeam = null;
      return;
    }

    if (this.midCaptureTeam !== dominant) {
      this.midCaptureTeam = dominant;
      this.midCaptureProgress = 0;
    }

    // Ju fler units du har i zonen, desto lite snabbare går capture.
    const bonusUnits = dominant === TEAM.PLAYER ? playerCount : enemyCount;
    const speedBonus = Math.min(1.75, 1 + (bonusUnits - CONFIG.midCaptureMinUnits) * 0.12);

    this.midCaptureProgress += dt * speedBonus;

    if (this.midCaptureProgress >= CONFIG.midCaptureSeconds) {
      this.captureMid(dominant);
    }
  }

  captureMid(team) {
    this.midOwner = team;
    this.midCaptureProgress = CONFIG.midCaptureSeconds;
    const tower = this.structures.find(s => s.key === "midTower");
    if (tower) {
      tower.team = team;
      tower.hp = tower.maxHp;
      tower.dead = false;
      tower.key = team === TEAM.PLAYER ? "midTower" : "midTower";
    }
    this.units = this.units.filter(u => u.team !== TEAM.NEUTRAL);
    this.effects.push(new Effect("levelup", CONFIG.midTowerX, 260, 1.2));
    this.addXp(150, team);
  }


  updateGateArchers(dt) {
    if (!this.gateArchers || !this.gateArchers.length) return;

    for (const archer of this.gateArchers) {
      archer.timer -= dt;
      if (archer.timer > 0) continue;

      const gateKey = archer.team === TEAM.PLAYER ? "blueGate" : "redGate";
      const gate = this.structures.find(s => s.key === gateKey && !s.dead);
      if (!gate) continue;

      const target = this.units
        .filter(u => u.team !== archer.team && u.team !== TEAM.NEUTRAL && !u.dead)
        .filter(u => Math.abs(u.x - archer.x) <= CONFIG.gateArcherRange)
        .sort((a, b) => Math.abs(a.x - archer.x) - Math.abs(b.x - archer.x))[0];

      if (!target) continue;

      this.projectiles.push(new Projectile({
        type: "arrow",
        team: archer.team,
        x: archer.x,
        y: archer.y,
        target,
        dmg: CONFIG.gateArcherDamage,
        speed: 680
      }));

      archer.timer = CONFIG.gateArcherAttackSeconds;
    }
  }


  updateGateArchers(dt) {
    if (!this.gateArchers || !this.gateArchers.length) return;

    for (const archer of this.gateArchers) {
      archer.timer -= dt;
      if (archer.timer > 0) continue;

      const gateKey = archer.team === TEAM.PLAYER ? "blueGate" : "redGate";
      const gate = this.structures.find(s => s.key === gateKey && !s.dead);
      if (!gate) continue;

      const target = this.units
        .filter(u => u.team !== archer.team && u.team !== TEAM.NEUTRAL && !u.dead)
        .filter(u => Math.abs(u.x - archer.x) <= CONFIG.gateArcherRange)
        .sort((a, b) => Math.abs(a.x - archer.x) - Math.abs(b.x - archer.x))[0];

      if (!target) continue;

      this.projectiles.push(new Projectile({
        type: "arrow",
        team: archer.team,
        x: archer.x,
        y: archer.y,
        target,
        dmg: CONFIG.gateArcherDamage,
        speed: 680
      }));

      archer.timer = CONFIG.gateArcherAttackSeconds;
    }
  }


  updateGateArchers(dt) {
    if (!this.gateArchers || !this.gateArchers.length) return;

    for (const archer of this.gateArchers) {
      archer.timer -= dt;
      if (archer.timer > 0) continue;

      const gateKey = archer.team === TEAM.PLAYER ? "blueGate" : "redGate";
      const gate = this.structures.find(s => s.key === gateKey && !s.dead);
      if (!gate) continue;

      const target = this.units
        .filter(u => u.team !== archer.team && u.team !== TEAM.NEUTRAL && !u.dead)
        .filter(u => Math.abs(u.x - archer.x) <= CONFIG.gateArcherRange)
        .sort((a, b) => Math.abs(a.x - archer.x) - Math.abs(b.x - archer.x))[0];

      if (!target) continue;

      this.projectiles.push(new Projectile({
        type: "arrow",
        team: archer.team,
        x: archer.x,
        y: archer.y,
        target,
        dmg: CONFIG.gateArcherDamage,
        speed: 680
      }));

      archer.timer = CONFIG.gateArcherAttackSeconds;
    }
  }

  updateUnits(dt) {
    for (const u of this.units) {
      if (u.dead) continue;
      if (u.stun > 0) { u.stun -= dt; continue; }

      if (u.def.ability) this.tryAbility(u, dt);

      const target = this.findTarget(u);
      if (u.role === "support") {
        const ally = this.findHurtAlly(u);
        if (ally && Math.abs(ally.x - u.x) < u.range) {
          this.attackOrHeal(u, ally, dt, true);
          continue;
        }
      }

      if (target && Math.abs(target.x - u.x) <= u.range) {
        this.attackOrHeal(u, target, dt, false);
      } else {
        this.moveUnit(u, dt);
      }
    }
  }

  moveUnit(u, dt) {
    if (u.team === TEAM.NEUTRAL) {

      // Leta efter närmaste fiende nära mitten
      const target = this.units
        .filter(o =>
          o.team !== TEAM.NEUTRAL &&
          !o.dead &&
          Math.abs(o.x - CONFIG.midTowerX) < 700
        )
        .sort((a, b) => Math.abs(a.x - u.x) - Math.abs(b.x - u.x))[0];

      // Om ranged attackerar dem -> spring fram
      if (target) {
        const dir = Math.sign(target.x - u.x);
        u.x += dir * 70 * dt;
      }

      // Stanna inom mittenområde
      u.x = Math.max(CONFIG.midTowerX - 320, Math.min(CONFIG.midTowerX + 320, u.x));

      return;
    }
    if (u.team === TEAM.PLAYER && u.order === ORDER.DEFEND) {
      const defendX = this.getPlayerDefendX();
      if (Math.abs(u.x - defendX) > 45) u.x += Math.sign(defendX - u.x) * u.speed * dt;
      return;
    }
    u.x += u.dir * u.speed * dt;
    u.x = Math.max(80, Math.min(CONFIG.worldWidth - 80, u.x));
  }

  getPlayerDefendX() {
    const gate = this.structures.find(s => s.key === "blueGate" && !s.dead);
    return gate ? gate.x - 115 : CONFIG.playerBaseX + 230;
  }

  findTarget(u) {
    const enemies = [
      ...this.units.filter(o => this.isEnemy(u, o) && !o.dead),
      ...this.structures.filter(o => this.isEnemy(u, o) && !o.dead)
    ];

    if (u.team === TEAM.NEUTRAL) {
      return enemies
        .filter(o => Math.abs(o.x - CONFIG.midTowerX) < 430)
        .sort((a,b) => Math.abs(a.x-u.x)-Math.abs(b.x-u.x))[0];
    }

    return enemies.sort((a,b) => Math.abs(a.x-u.x)-Math.abs(b.x-u.x))[0];
  }

  isEnemy(a, b) {
    if (a.team === TEAM.NEUTRAL) return b.team !== TEAM.NEUTRAL;
    if (b.team === TEAM.NEUTRAL) return this.midOwner === TEAM.NEUTRAL && Math.abs(a.x - CONFIG.midTowerX) < 520;
    if (b.kind === "structure" && b.key === "midTower") return b.team !== TEAM.NEUTRAL && a.team !== b.team;
    return a.team !== b.team;
  }

  findHurtAlly(u) {
    return this.units
      .filter(o => o.team === u.team && o.hp < o.maxHp && !o.dead)
      .sort((a,b) => (a.hp/a.maxHp) - (b.hp/b.maxHp))[0];
  }

  attackOrHeal(u, target, dt, healing) {
    u.attackTimer -= dt;
    if (u.attackTimer > 0) return;
    u.attackTimer = u.attackPeriod;

    if (healing) {
      target.hp = Math.min(target.maxHp, target.hp + (u.def.heal || 8));
      this.effects.push(new Effect("heal", target.x, target.y - 40, 0.5));
      return;
    }

    if (u.def.projectile) {
      this.projectiles.push(new Projectile({
        type: u.def.projectile, team: u.team,
        x: u.x + u.dir * 35, y: u.y - 60,
        target, dmg: u.dmg,
        speed: u.def.projectile === "lightning" ? 900 : 560,
        splash: u.def.projectile === "returnOrb" ? 70 : 0,
        returning: u.def.projectile === "returnOrb"
      }));
    } else {
      this.damage(target, u.dmg, u);
      this.effects.push(new Effect("slash", target.x, target.y - 55, 0.28, {dir:u.dir}));
    }
  }

  damage(target, amount, source=null) {
    const real = Math.max(1, amount - (target.armor || 0));
    target.hp -= real;
    if (source?.def?.stun) target.stun = Math.max(target.stun || 0, source.def.stun);
    if (target.hp <= 0 && !target.dead) {
      target.dead = true;
      const killerTeam = source?.team || TEAM.PLAYER;
      if (target.kind === "structure" && target.team !== killerTeam && !target.xpAwarded) {
        target.xpAwarded = true;
        this.addXp(CONFIG.xpFromStructureDestroy, killerTeam);
      }
    }
  }

  tryAbility(u, dt) {
    u.abilityTimer -= dt;
    if (u.abilityTimer > 0) return;
    u.abilityTimer = 5.5 + Math.random() * 2;

    const enemies = this.units.filter(o => this.isEnemy(u,o) && Math.abs(o.x-u.x) < 180 && !o.dead);
   if (u.def.ability === "cyclone") {
  this.effects.push(
    new Effect("woolkongStaffSpin", u.x, u.y - 72, 1.05, {
      dir: u.dir,
      radius: 95
    })
  );

  enemies.forEach(e => {
    this.damage(e, 22, u);
    e.stun = Math.max(e.stun, 0.7);
  });
}
    if (u.def.ability === "susano") {
      this.effects.push(
  new Effect("susano", u.x + u.dir * 110, u.y - 78, 0.7, {
    dir: u.dir,
    color: "#b84cff"
  })
);
      enemies.forEach(e => this.damage(e, 45, u));
    }
    if (u.def.ability === "storm" || u.def.ability === "lightningStorm") {
  this.effects.push(
    new Effect("stormOrbReturn", u.x, u.y - 78, 1.05, {
      dir: u.dir,
      distance: 230,
      color: "#0b2f8a",
      glow: "#7dd3fc"
    })
  );

  enemies.forEach(e => {
    this.damage(e, 34, u);
    e.stun = Math.max(e.stun, 0.35);
  });
}
  }

  updateProjectiles(dt) {
    for (const p of this.projectiles) {
      p.life -= dt;
      if (!p.target || p.target.dead || p.life <= 0) { p.dead = true; continue; }
      const tx = p.target.x, ty = p.target.y - 55;
      const dx = tx - p.x, dy = ty - p.y;
      const d = Math.hypot(dx, dy) || 1;
      p.x += dx / d * p.speed * dt;
      p.y += dy / d * p.speed * dt;
      if (d < 24) {
        this.damage(p.target, p.dmg, {team:p.team});
        this.effects.push(new Effect(p.type === "lightning" ? "lightning" : "hit", tx, ty, 0.25));
        if (p.splash) {
          for (const u of this.units) if (u.team !== p.team && Math.abs(u.x-tx) < p.splash) this.damage(u, p.dmg*0.45, {team:p.team});
        }
        p.dead = true;
      }
    }
    this.projectiles = this.projectiles.filter(p => !p.dead);
  }

  cleanup() {
    const deadUnits = this.units.filter(u => u.dead);
    for (const u of deadUnits) {
      const killerTeam = u.team === TEAM.PLAYER ? TEAM.ENEMY : TEAM.PLAYER;
      if (killerTeam === TEAM.PLAYER) this.gold += 4;
      else this.enemyGold += 4 * this.difficulty.enemyGoldMult;
      this.addXp(CONFIG.xpFromUnitKill, killerTeam);
    }
    this.units = this.units.filter(u => !u.dead);
  }

  updateCamera(dt) {
    const playerFront = Math.max(CONFIG.playerBaseX, ...this.units.filter(u => u.team === TEAM.PLAYER).map(u => u.x));
    const desired = Math.max(0, Math.min(CONFIG.worldWidth - 1280, playerFront - 520));
    this.cameraX += (desired - this.cameraX) * Math.min(1, dt * 2.8);
  }

 checkWinLose() {
  const enemyBase = this.structures.find(s => s.key === "enemyBase");
  const playerBase = this.structures.find(s => s.key === "playerBase");

  if (enemyBase.dead) {

    // Lee Sin unlock
    if (
  this.factionKey === "shaolin" &&
  this.difficultyKey === "hard"
) {
  markShaolinHardWin();
}

    this.gameOver = "VICTORY";
  }

  if (playerBase.dead) {
    this.gameOver = "DEFEAT";
  }
}
}
