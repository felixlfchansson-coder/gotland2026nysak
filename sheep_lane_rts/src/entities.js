import { CONFIG, TEAM, ORDER } from "./config.js";

let nextId = 1;

export class Structure {
  constructor({key, team, x, y, w, h, hp, maxHp}) {
    this.id = nextId++;
    this.kind = "structure";
    this.key = key;
    this.team = team;
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.hp = hp; this.maxHp = maxHp ?? hp;
    this.dead = false;
  }
}

export class Unit {
  constructor({team, x, def, faction}) {
    this.id = nextId++;
    this.kind = "unit";
    this.team = team;
    this.faction = faction;
    this.def = def;
    this.key = def.key;
    this.name = def.name;
    this.x = x;
    this.y = CONFIG.laneY;
    this.w = def.size;
    this.h = def.size;
    this.hp = def.hp;
    this.maxHp = def.hp;
    this.dmg = def.dmg;
    this.range = def.range;
    this.speed = def.speed;
    this.attackPeriod = def.atk;
    this.attackTimer = Math.random() * 0.4;
    this.armor = def.armor || 0;
    this.role = def.role;
    this.order = team === TEAM.PLAYER ? ORDER.DEFEND : ORDER.ATTACK;
    this.stun = 0;
    this.abilityTimer = 3 + Math.random() * 2;
    this.dead = false;
  }

  get dir() {
    return this.team === TEAM.PLAYER ? 1 : -1;
  }
}

export class Effect {
  constructor(type, x, y, life = 0.45, data = {}) {
    this.type = type; this.x = x; this.y = y;
    this.life = life; this.maxLife = life;
    Object.assign(this, data);
  }
}

export class Projectile {
  constructor({type, team, x, y, target, dmg, speed = 520, splash = 0, returning = false}) {
    this.type = type;
    this.team = team;
    this.x = x; this.y = y;
    this.target = target;
    this.dmg = dmg;
    this.speed = speed;
    this.splash = splash;
    this.returning = returning;
    this.life = 3;
  }
}
