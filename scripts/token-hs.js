import {
  hasAchievement,
  getUnlockedAchievements
} from "./achievements.js";

import {
  hasCosmetic,
  getUnlockedCosmetics,
  markPageVisited
} from "./cosmetics.js";

markPageVisited("token-hs");

const playerName =
  localStorage.getItem("userName") ||
  localStorage.getItem("username") ||
  "Spelare";

document.querySelectorAll(".player-name").forEach((el) => {
  el.textContent = playerName;
});

const AVATAR_ID_MAP = {
  glasses_sunglasses: "glasses_sunglasses",
  glasses_doffy: "glasses_doffy",
  glasses_harry_potter: "harry_potter",
  glasses_hawaii: "glasses_hawaii",
  glasses_lee_sin: "lee_sin",

  hat_tophat: "hat_tophat",
  hat_cowboy: "hat_cowboy",
  hat_fez: "hat_fez",
  hat_sortinghat: "sorting_hat",
  hat_strawhat: "hat_strawhat",

  body_base: "body_base",
  body_black: "black_sheep",
  body_crimson: "crimson_sheep",
  body_magenta: "body_magenta",
  body_petrol: "petrol_sheep",
  body_senap: "body_senap",
  body_viridian: "viridian_sheep"
};

const START_UNLOCKS = [
  "glasses_sunglasses",
  "hat_tophat",
  "body_base"
];

function isAvatarUnlocked(profileId) {
  if (START_UNLOCKS.includes(profileId)) return true;

  const mappedId = AVATAR_ID_MAP[profileId] || profileId;

  return (
    hasCosmetic(mappedId) ||
    getUnlockedCosmetics().includes(mappedId) ||
    JSON.parse(localStorage.getItem("unlockedAvatarItems") || "[]")
      .includes(profileId)
  );
}

document.querySelectorAll(".unlock-item").forEach((item) => {
  const id = item.dataset.unlockId;

  if (isAvatarUnlocked(id)) {
    item.classList.remove("locked");
    item.classList.add("unlocked");
  } else {
    item.classList.remove("unlocked");
    item.classList.add("locked");
  }

  const img = item.querySelector("img");
  if (img) {
    img.onerror = () => {
      img.onerror = null;
      img.src = "images/cosmetics/fallback.png";
    };
  }
});

const ACHIEVEMENT_ID_MAP = {
  flyhage_escape: "flyktmastare",
  flyhage_fast_escape: "snabb_far",
  sheepline_hard: "sheep_line_hard",
  quiz_highscore: "quiz_master",

  woolborn_easy: "woolborn_clear",
  woolborn_normal: "woolborn_clear",
  woolborn_hard: "woolborn_hard",
  woolborn_insane: "woolborn_insane",

  woolborn_shaolin: "storm_master",
  woolborn_assassin: "susano_shadow",
  woolborn_mage: "woolkong_king"
};

document.querySelectorAll(".token-card").forEach((card) => {
  const oldId = card.dataset.achievementId;
  const realId = ACHIEVEMENT_ID_MAP[oldId] || oldId;

  if (hasAchievement(realId)) {
    card.classList.remove("locked");
    card.classList.add("unlocked");
  } else {
    card.classList.remove("unlocked");
    card.classList.add("locked");
  }

  const img = card.querySelector("img");
  if (img) {
    img.onerror = () => {
      img.onerror = null;
      img.src = "images/achievements/fallback.png";
    };
  }
});

document.querySelectorAll(".challenge-card").forEach((card) => {
  card.classList.add("locked");
});