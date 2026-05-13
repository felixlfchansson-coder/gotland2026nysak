import { markFlyhageCharacterWin } from "./cosmetics.js";
import { submitHighscore } from "./highscores.js";
import { unlockAchievement } from "./achievements.js";

document.addEventListener("DOMContentLoaded", () => {
  let sheep = {};

  const STAT_LIMIT = 100;

  const healthDisplay = document.getElementById("health-display");
  const hungerDisplay = document.getElementById("hunger-display");
  const woodDisplay = document.getElementById("wood-display");
  const dayDisplay = document.getElementById("day-display");
  const courageDisplay = document.getElementById("courage-display");
  const inventoryDisplay = document.getElementById("inventory-display");
  const timeDisplay = document.getElementById("time-display");
  const logArea = document.getElementById("log-area");
  const sheepNameDisplay = document.getElementById("sheep-name-display");
  const sheepTypeDisplay = document.getElementById("sheep-type-display");
  const escapePlanDisplay = document.getElementById("escape-plan-display");
  const sheepImage = document.getElementById("sheep-image");

  const gatherWoodBtn = document.getElementById("gather-wood-btn");
  const searchFoodBtn = document.getElementById("search-food-btn");
  const restBtn = document.getElementById("rest-btn");
  const exploreBtn = document.getElementById("explore-btn");
  const searchBarnBtn = document.getElementById("search-barn-btn");
  const escapeBtn = document.getElementById("escape-btn");
  const restartBtn = document.getElementById("restart-btn");

  const actionButtons = [
    gatherWoodBtn,
    searchFoodBtn,
    restBtn,
    exploreBtn,
    searchBarnBtn,
    escapeBtn
  ];

  const sheepTypes = [
    {
      name: "Clark Ullofsson",
      type: "Mästerflykting",
      image: "images/clarken.png"
    },
    {
      name: "Bäännie Clyde",
      type: "Kaos-får",
      image: "images/bannie.png"
    },
    {
      name: "Sheep Houdini",
      type: "Utbrytarkung",
      image: "images/houdini.png"
    },
    {
      name: "The Woolfather",
      type: "Hagens gudfader",
      image: "images/woolfather.png"
    },
    {
      name: "Mother Bäärisa",
      type: "Heligt får",
      image: "images/mother.png"
    },
    {
      name: "Sheepra Winfry",
      type: "Ullmiljonär",
      image: "images/winfry.png"
    }
  ];

  const escapePlans = [
    ["Rosa ull 🌸", "Äpple 🍎", "Trumpet 🎺"],
    ["Nyckel 🔑", "Morot 🥕", "Cowboyhatt 🤠"],
    ["Magisk ull ✨", "Fisk 🐟", "Sked 🥄"],
    ["Karta 🗺️", "Guldklocka ⏰", "Blåbär 🫐"],
    ["Bensindunk ⛽", "Banjo 🪕", "Gurka 🥒"]
  ];

  function initializeGame() {
    const chosenSheep = sheepTypes[Math.floor(Math.random() * sheepTypes.length)];
    const chosenPlan = escapePlans[Math.floor(Math.random() * escapePlans.length)];

    sheep = {
      name: chosenSheep.name,
      type: chosenSheep.type,
      image: chosenSheep.image,
      health: 100,
      energy: 60,
      courage: 25,
      wool: 0,
      inventory: [],
      escapePlan: chosenPlan,
      day: 1,
      log: []
    };

    sheep.log.push(`🐑 Du är ${sheep.name}, ett ${sheep.type}.`);
    sheep.log.push("🚪 Friheten väntar utanför hagen...");

    actionButtons.forEach(btn => {
      if (btn) btn.disabled = false;
    });

    if (restartBtn) restartBtn.style.display = "none";

    renderUI();
  }

  function renderUI() {
    if (healthDisplay) {
      healthDisplay.textContent = sheep.health;
      updateStatColor(healthDisplay, sheep.health);
    }

    if (hungerDisplay) {
      hungerDisplay.textContent = sheep.energy;
      updateStatColor(hungerDisplay, sheep.energy);
    }

    if (woodDisplay) woodDisplay.textContent = sheep.wool;
    if (dayDisplay) dayDisplay.textContent = sheep.day;
    if (timeDisplay) timeDisplay.textContent = sheep.day % 2 === 0 ? "Natt 🌙" : "Dag ☀️";

    if (courageDisplay) {
      courageDisplay.textContent = sheep.courage;
      updateStatColor(courageDisplay, sheep.courage);
    }

    if (sheepNameDisplay) sheepNameDisplay.textContent = sheep.name;
    if (sheepTypeDisplay) sheepTypeDisplay.textContent = `Typ: ${sheep.type}`;

    if (inventoryDisplay) {
      inventoryDisplay.textContent =
        sheep.inventory.length > 0 ? sheep.inventory.join(", ") : "Tom";
    }

    if (sheepImage) {
      sheepImage.src = sheep.image;
      sheepImage.alt = sheep.name;
    }

    if (escapePlanDisplay) {
      escapePlanDisplay.innerHTML = sheep.escapePlan
        .map(item => sheep.inventory.includes(item) ? `✅ ${item}` : `❌ ${item}`)
        .join("<br>");
    }

    if (logArea) {
      logArea.innerHTML = sheep.log.slice(-7).reverse().join("<br>");
    }
  }

  function updateStatColor(element, value) {
    element.className =
      value < 25 ? "stat-danger" :
      value < 50 ? "stat-warning" :
      "stat-good";
  }

  function nextDay(message) {
    sheep.day++;
    sheep.energy -= 5;
    sheep.log.push(message);

    randomEvent();
    characterAbilities();
    clampStats();
    checkDeath();
    renderUI();
  }

  function clampStats() {
    sheep.health = Math.min(Math.max(0, sheep.health), STAT_LIMIT);
    sheep.energy = Math.min(Math.max(0, sheep.energy), STAT_LIMIT);
    sheep.courage = Math.min(Math.max(0, sheep.courage), STAT_LIMIT);
  }

  function checkDeath() {
    if (sheep.health <= 0) {
      sheep.log.push(`💀 GAME OVER: ${sheep.name} klarade inte flykten.`);
      disableActions();
    }
  }

  function randomEvent() {
    const chance = Math.random();

    if (chance < 0.2) {
      sheep.courage += 10;
      sheep.log.push("🐑 Ett äldre får berättar om världen utanför. +10 mod.");
    } else if (chance < 0.4) {
      sheep.health -= 10;
      sheep.energy -= 8;
      sheep.courage -= 6;
      sheep.log.push("🐕 Vakthunden jagar dig! -10 hälsa, -8 energi, -6 mod.");
    } else if (chance < 0.55) {
      sheep.energy -= 10;
      sheep.log.push("🌧️ Regnet gör ullen tung. -10 energi.");
    } else if (chance < 0.7) {
      sheep.wool += 2;
      sheep.log.push("🧶 Du fastnade i en buske och fick loss extra ull. +2 ull.");
    }
  }

  function characterAbilities() {
    if (sheep.name === "Mother Bäärisa") {
      sheep.health += 3;
      sheep.log.push("🙏 Mother Bäärisa spred lugn i hagen. +3 hälsa.");
    }

    if (sheep.name === "Sheepra Winfry") {
      const freeItems = ["Äpple 🍎", "Trumpet 🎺", "Morot 🥕", "Blåbär 🫐"];

      if (Math.random() < 0.25) {
        const gift = freeItems[Math.floor(Math.random() * freeItems.length)];

        if (!sheep.inventory.includes(gift)) {
          sheep.inventory.push(gift);
          sheep.log.push(`🎁 "DU får ${gift}!"`);
        }
      }
    }

    if (sheep.name === "Clark Ullofsson") {
      sheep.courage += 2;

      if (Math.random() < 0.2) {
        sheep.health -= 8;
        sheep.log.push("🐕 Clark Ullofsson gjorde för mycket oväsen. -8 hälsa.");
      }
    }

    if (sheep.name === "Sheep Houdini") {
      sheep.courage += 4;
      sheep.health -= 2;
      sheep.log.push("🎩 Sheep Houdini tränade flyktkonster. +4 mod, -2 hälsa.");
    }

    if (sheep.name === "The Woolfather") {
      sheep.courage += 3;
      sheep.energy -= 3;
      sheep.log.push("🍝 Woolfather höll ett mystiskt möte. +3 mod, -3 energi.");
    }

    if (sheep.name === "Bäännie Clyde") {
      if (Math.random() < 0.2) {
        sheep.health -= 6;
        sheep.log.push("💥 Bäännie Clyde skapade kaos i ladan. -6 hälsa.");
      }

      if (Math.random() < 0.25) {
        const chaosItems = ["Banjo 🪕", "Gurka 🥒", "Cowboyhatt 🤠"];
        const loot = chaosItems[Math.floor(Math.random() * chaosItems.length)];

        if (!sheep.inventory.includes(loot)) {
          sheep.inventory.push(loot);
          sheep.log.push(`🪵 Bäännie Clyde stal ${loot}.`);
        }
      }
    }
  }

  function gatherWool() {
    const woolFound = Math.floor(Math.random() * 3) + 1;
    sheep.wool += woolFound;
    sheep.energy -= 8;

    nextDay(`🧶 Du samlade ${woolFound} ull.`);
  }

  function searchFood() {
    sheep.energy += 15;
    nextDay("🌾 Du åt gott gräs.");
  }

  function rest() {
    if (sheep.wool < 5) {
      sheep.log.push("⛔ Du behöver mer ull.");
      renderUI();
      return;
    }

    sheep.wool -= 5;
    sheep.health += 15;
    sheep.courage += 10;

    nextDay("😴 Du vilade tryggt.");
  }

  function explore() {
    sheep.energy -= 10;
    sheep.courage += 8;

    nextDay("🔎 Du utforskade hagen.");
  }

  function searchBarn() {
    if (sheep.energy < 10) {
      sheep.log.push("😴 Du är för trött.");
      renderUI();
      return;
    }

    sheep.energy -= 10;

    const items = [
      "Rosa ull 🌸",
      "Trumpet 🎺",
      "Cowboyhatt 🤠",
      "Morot 🥕",
      "Sked 🥄",
      "Karta 🗺️",
      "Blåbär 🫐",
      "Banjo 🪕",
      "Gurka 🥒",
      "Bensindunk ⛽",
      "Fisk 🐟",
      "Guldklocka ⏰",
      "Äpple 🍎",
      "Nyckel 🔑",
      "Magisk ull ✨"
    ];

    const foundItem = items[Math.floor(Math.random() * items.length)];

    if (!sheep.inventory.includes(foundItem)) {
      sheep.inventory.push(foundItem);
      nextDay(`🔎 Du hittade ${foundItem}.`);
    } else {
      nextDay("🪵 Du hittade inget nytt.");
    }
  }

  function tryEscape() {
    const hasPlanItems = sheep.escapePlan.every(item =>
      sheep.inventory.includes(item)
    );

    if (sheep.courage < 40 || sheep.energy < 15 || !hasPlanItems) {
      sheep.log.push("⛔ Du saknar saker till flyktplanen, 40 mod eller 15 energi.");
      renderUI();
      return;
    }

    const success = Math.random();

    if (success > 0.5) {
      sheep.log.push(`🎉 ${sheep.name} flydde från hagen!`);

      submitHighscore({
        game: "flyhage",
        category: "fastest_escape",
        score: sheep.day,
        extraData: {
          character: sheep.name
        }
      });

      unlockAchievement("flyktmastare");

      if (sheep.day <= 5) {
        unlockAchievement("snabb_far");
      }

      markFlyhageCharacterWin(sheep.name);

      disableActions();
      renderUI();
    } else {
      sheep.health -= 20;
      sheep.energy -= 15;
      sheep.courage -= 10;

      sheep.log.push("🐕 Vakthunden stoppade dig! -20 hälsa, -15 energi, -10 mod.");

      clampStats();
      checkDeath();
      renderUI();
    }
  }

  function disableActions() {
    actionButtons.forEach(btn => {
      if (btn) btn.disabled = true;
    });

    if (restartBtn) restartBtn.style.display = "block";
  }

  if (gatherWoodBtn) gatherWoodBtn.addEventListener("click", gatherWool);
  if (searchFoodBtn) searchFoodBtn.addEventListener("click", searchFood);
  if (restBtn) restBtn.addEventListener("click", rest);
  if (exploreBtn) exploreBtn.addEventListener("click", explore);
  if (searchBarnBtn) searchBarnBtn.addEventListener("click", searchBarn);
  if (escapeBtn) escapeBtn.addEventListener("click", tryEscape);
  if (restartBtn) restartBtn.addEventListener("click", initializeGame);

  initializeGame();
});