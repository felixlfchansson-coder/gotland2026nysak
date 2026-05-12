import { CONFIG } from "./config.js";

/*
  ASSET SYSTEM
  Lägg dina bilder i /assets och ändra filnamnen här.

  Rekommenderade format:
  - Bakgrund: 6400x720 PNG/JPG
  - Unit sprites: transparent PNG/WebP
  - Ikoner: 256x256 PNG/WebP
  - UI frames: transparent PNG/WebP
  - Effects: transparent PNG/WebP
*/
export const SPRITES = {
  // Background
  background: "battlefield.png",

  // Structures
  playerBase: "blue_base.png",
  enemyBase: "red_base.png",
  blueGate: "blue_gate.png",
  redGate: "red_gate.png",
  midTower: "mid_tower.png",

  // Standard
  standardsword1: "standardsword1.png",
  standardarcher2: "standardarcher2.png",
  standardtank3: "standardtank3.png",
  standardhealer4: "standardhealer4.png",

  // Assassin / Shadow
  shadowsword1: "shadowsword1.png",
  shadowarcher2: "shadowarcher2.png",
  susanoBoss: "susano_boss.png",

  // Arcane Mage
  arcanesword1: "arcanesword1.png",
  arcanearcher2: "arcanearcher2.png",
  stormMageBoss: "storm_mage_boss.png",

  // Shaolin
  staffmonk1: "staffmonk1.png",
  flutemonk2: "flutemonk2.png",
  woolkong3: "woolkong3.png",

  // Ironhoof
  ironhoof1: "ironhoof1.png",
  ironhoof2: "ironhoof2.png",
  fortressBoss: "fortress_boss.png",

  // Stormflock
  stormflock1: "stormflock1.png",
  stormflock2: "stormflock2.png",
  thunderBoss: "thunder_boss.png",

  // Neutral
  wolfsheep: "wolfsheep.png"
};

export const UI_ASSETS = {
  // General UI frames
  buttonFrame: "ui/button_frame.png",
  buttonFrameActive: "ui/button_frame_active.png",
  buttonFrameLocked: "ui/button_frame_locked.png",
  choiceFrame: "ui/choice_frame.png",
  cardFrame: "ui/card_frame.png",
  panelFrame: "ui/panel_frame.png",

};



export const EFFECT_ASSETS = {
  orb: "effects/orb.png",
  lightning: "effects/lightning.png",
  slash: "effects/slash.png"
};

const images = new Map();

function loadOne(key, file) {
  return new Promise((resolve) => {
    const img = new Image();
    const path = CONFIG.imagePath + file;

    img.onload = () => {
      images.set(key, img);
      resolve();
    };

    img.onerror = () => {
      console.warn("Missing asset:", path);

      // fallback så spelet inte kraschar
      images.set(key, null);

      resolve();
    };

    img.src = path;
  });
}

export function loadImages() {
  // Under utveckling: kör placeholders utan att försöka ladda saknade bilder.
  // När du har lagt in riktiga bilder i /assets, ändra useExternalAssets till true i src/config.js.
  if (!CONFIG.useExternalAssets) {
    console.log("External assets disabled. Running with placeholder art.");
    return Promise.resolve();
  }

  const all = {
    ...SPRITES,
    ...UI_ASSETS,
    ...Object.fromEntries(
      Object.entries(EFFECT_ASSETS).map(([k, v]) => [`effect_${k}`, v])
    )
  };

  return Promise.all(
    Object.entries(all).map(([key, file]) => loadOne(key, file))
  );
}

export function getImage(key) {
  return images.get(key) || null;
}

export function hasImage(key) {
  return images.has(key);
}

export function getUnitIconKey(unitKey) {
  const normalized = unitKey.charAt(0).toUpperCase() + unitKey.slice(1);
  return `icon${normalized}`;
}

export function getFactionIconKey(factionKey) {
  const map = {
    standard: "iconStandard",
    shadow: "iconAssassin",
    arcane: "iconArcane",
    shaolin: "iconShaolin",
    ironhoof: "iconIronhoof",
    stormflock: "iconStormflock"
  };

  return map[factionKey] || "iconStandard";
}