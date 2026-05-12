import { CONFIG, TEAM } from "./config.js";
import { getImage } from "./assets.js";

export class Renderer {
  constructor(canvas, game) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.game = game;
  }

  render() {
    const ctx = this.ctx, g = this.game;
    ctx.clearRect(0,0,1280,720);
    ctx.save();
    ctx.translate(-g.cameraX, 0);
    this.background(ctx);
    for (const s of g.structures) this.structure(ctx, s);
    for (const a of g.gateArchers || []) this.gateArcher(ctx, a);
    this.midCapture(ctx);
    for (const p of g.projectiles) this.projectile(ctx, p);
    for (const u of [...g.units].sort((a,b)=>a.y-b.y)) this.unit(ctx, u);
    for (const e of g.effects) this.effect(ctx, e);
    ctx.restore();
  }

  background(ctx) {
    const bg = getImage("background");
    if (bg) ctx.drawImage(bg, 0, 0, CONFIG.worldWidth, CONFIG.worldHeight);
    else {
      const sky = ctx.createLinearGradient(0,0,0,540);
      sky.addColorStop(0,"#86c5ff"); sky.addColorStop(1,"#d7f8aa");
      ctx.fillStyle = sky; ctx.fillRect(0,0,CONFIG.worldWidth,720);
      ctx.fillStyle = "#557c35"; ctx.fillRect(0,CONFIG.groundY,CONFIG.worldWidth,185);
      ctx.fillStyle = "rgba(255,255,255,.18)";
      for (let x=0;x<CONFIG.worldWidth;x+=320) ctx.fillRect(x, CONFIG.groundY+30, 170, 8);
    }
    ctx.fillStyle = "rgba(255,255,255,.18)";
    ctx.fillRect(CONFIG.midTowerX-6, 0, 12, 720);

    // dim cinematic overlay
    const grd = ctx.createLinearGradient(0,0,0,720);
    grd.addColorStop(0, "rgba(10,20,40,0.15)");
    grd.addColorStop(1, "rgba(0,0,0,0.28)");
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,CONFIG.worldWidth,720);

  }

  structure(ctx, s) {
    const img = getImage(s.key);
    if (img) ctx.drawImage(img, s.x-s.w/2, s.y, s.w, s.h);
    else {
      ctx.fillStyle = s.team === TEAM.PLAYER ? "#2563eb" : s.team === TEAM.ENEMY ? "#dc2626" : "#6b7280";
      ctx.fillRect(s.x-s.w/2, s.y, s.w, s.h);
      ctx.fillStyle = "white";
      ctx.font = "bold 22px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(s.key, s.x, s.y+50);
    }
    this.bar(ctx, s.x-s.w/2, s.y-22, s.w, 12, s.hp/s.maxHp, s.team);
  }

  unit(ctx, u) {
    const img = getImage(u.key);
    const x = u.x - u.w/2, y = u.y - u.h;
    if (img) {
      ctx.save();
      if (u.team === TEAM.ENEMY) {
        ctx.translate(u.x, 0); ctx.scale(-1,1); ctx.drawImage(img, -u.w/2, y, u.w, u.h);
      } else ctx.drawImage(img, x, y, u.w, u.h);
      ctx.restore();
    } else {
      ctx.fillStyle = u.team === TEAM.PLAYER ? "#dbeafe" : u.team === TEAM.ENEMY ? "#fecaca" : "#4b5563";
      ctx.beginPath(); ctx.ellipse(u.x, u.y-u.h/2, u.w/2, u.h/2, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#111827"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(u.name, u.x, u.y-u.h/2+4);
    }
    // glow aura for bosses/tanks
    if (u.maxHp > 300) {
      ctx.beginPath();
      ctx.arc(u.x, u.y - u.h/2, u.w * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = u.team === TEAM.PLAYER ? "rgba(80,160,255,0.12)" : "rgba(255,80,80,0.12)";
      ctx.fill();
    }

    this.bar(ctx, u.x-u.w/2, u.y-u.h-18, u.w, 8, u.hp/u.maxHp, u.team);

  }

  gateArcher(ctx, a) {
  if (!a) return;

  const gateKey = a.team === TEAM.PLAYER ? "blueGate" : "redGate";
  const gate = this.game.structures.find(s => s.key === gateKey && !s.dead);
  if (!gate) return;

  const img = getImage(a.key);
  const size = 54;

  if (img) {
    ctx.save();

    if (a.team === TEAM.ENEMY) {
      ctx.translate(a.x, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, -size / 2, a.y - size, size, size);
    } else {
      ctx.drawImage(img, a.x - size / 2, a.y - size, size, size);
    }

    ctx.restore();
    return;
  }

  ctx.fillStyle = a.team === TEAM.PLAYER ? "#bfdbfe" : "#fecaca";
  ctx.beginPath();
  ctx.arc(a.x, a.y - 28, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#111827";
  ctx.font = "900 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ARCHER", a.x, a.y - 25);
}

  projectile(ctx, p) {
    const img = getImage(`effect_${p.type}`) || (p.type === "returnOrb" ? getImage("effect_orb") : null);
    if (img) {
      const s = p.type === "orb" || p.type === "returnOrb" ? 42 : 34;
      ctx.drawImage(img, p.x - s/2, p.y - s/2, s, s);
      return;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.type === "orb" || p.type === "returnOrb" ? 12 : 6, 0, Math.PI*2);
    ctx.fillStyle = p.type === "lightning" ? "#bfdbfe" : p.type === "orb" || p.type === "returnOrb" ? "#67e8f9" : "#f8fafc";
    ctx.fill();
  }

  effect(ctx, e) {
    const t = e.life / e.maxLife;
    const img = getImage(`effect_${e.type}`);
    ctx.save();
    ctx.globalAlpha = Math.max(0, t);

    if (img) {
      const size = e.type === "cyclone" ? 260 : e.type === "susano" ? 260 : e.type === "lightning" ? 220 : e.type === "levelup" ? 220 : 100;
      ctx.drawImage(img, e.x - size/2, e.y - size/2, size, size);
      ctx.restore();
      return;
    }

    if (e.type === "slash") {
      ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 9;
      ctx.beginPath(); ctx.arc(e.x, e.y, 42, -0.9, 0.9); ctx.stroke();
    } else if (e.type === "heal") {
      ctx.fillStyle = "#86efac";
      for (let i=0;i<6;i++) ctx.fillRect(e.x-20+i*8, e.y-30*t-i*4, 4, 12);
    } else if (e.type === "cyclone") {
      ctx.strokeStyle = "#fde68a"; ctx.lineWidth = 8;
      for (let r=45;r<e.radius;r+=38) { ctx.beginPath(); ctx.arc(e.x, e.y, r*(1.1-t*.2), 0, Math.PI*1.6); ctx.stroke(); }
    } else if (e.type === "susano") {
      ctx.strokeStyle = "#c4b5fd"; ctx.lineWidth = 16;
      ctx.beginPath(); ctx.moveTo(e.x-70, e.y-90); ctx.lineTo(e.x+80, e.y+70); ctx.stroke();
    } else if (e.type === "lightning") {
      ctx.strokeStyle = "#e0f2fe"; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(e.x, e.y-95); ctx.lineTo(e.x-30, e.y-20); ctx.lineTo(e.x+18, e.y-45); ctx.lineTo(e.x-8, e.y+40); ctx.stroke();
    } else if (e.type === "levelup") {
      ctx.fillStyle = "#facc15";
      ctx.font = "900 46px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("LEVEL UP!", e.x, e.y - (1-t)*40);
    } else {
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(e.x,e.y,20,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }

  midCapture(ctx) {
    const g = this.game;
    const x = CONFIG.midTowerX;
    const y = 318;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,.5)";
    ctx.fillRect(x - 130, y - 28, 260, 18);
    const pct = g.midCaptureProgress / CONFIG.midCaptureSeconds;
    ctx.fillStyle = g.midCaptureTeam === TEAM.PLAYER ? "#38bdf8" : g.midCaptureTeam === TEAM.ENEMY ? "#fb7185" : "#facc15";
    ctx.fillRect(x - 130, y - 28, 260 * pct, 18);
    ctx.strokeStyle = "rgba(255,255,255,.7)";
    ctx.strokeRect(x - 130, y - 28, 260, 18);

    ctx.font = "900 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    const owner = g.midOwner === TEAM.PLAYER ? "BLUE MID BASE" : g.midOwner === TEAM.ENEMY ? "RED MID BASE" : "NEUTRAL MID BASE";
    ctx.fillText(owner, x, y - 38);
    ctx.restore();
  }

  bar(ctx, x, y, w, h, pct, team) {
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = team === TEAM.PLAYER ? "#38bdf8" : team === TEAM.ENEMY ? "#fb7185" : "#facc15";
    ctx.fillRect(x, y, Math.max(0,w*pct), h);
    ctx.strokeStyle = "rgba(255,255,255,.7)";
    ctx.strokeRect(x, y, w, h);
  }
}
