import { FACTIONS } from "./factions.js";
import { CONFIG, ORDER } from "./config.js";
import { getImage, getUnitIconKey, getFactionIconKey } from "./assets.js";

export class UI {
  constructor(game) {
    this.game = game;

    this.gold = document.getElementById("gold");
    this.level = document.getElementById("level");
    this.aiLevel = document.getElementById("aiLevel");
    this.xp = document.getElementById("xp");
    this.wave = document.getElementById("wave");
    this.unitCap = document.getElementById("unitCap");
    this.factionName = document.getElementById("factionName");

    this.factionButtons = document.getElementById("factionButtons");
    this.unitButtons = document.getElementById("unitButtons");
    this.message = document.getElementById("message");

    this.choiceOverlay = document.getElementById("factionChoiceOverlay");
    this.choiceButtons = document.getElementById("factionChoiceButtons");

    this.startMenu = document.getElementById("startMenu");
    this.startGameBtn = document.getElementById("startGameBtn");

    this.attackBtn = document.getElementById("attackBtn");
    this.defendBtn = document.getElementById("defendBtn");

    this.selectedDifficulty = "normal";

    this.startMenu.classList.remove("is-closed");
    this.choiceOverlay.classList.add("is-closed");

    this.applyUiSkin();
    this.bindStartMenu();
    // Enter starts the game, useful for testing if mouse/touch is weird.
    window.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && !this.game.started) this.startGame();
    });
    this.bindOrderButtons();

    this.buildFactionButtons();
    this.buildUnitButtons();
    this.buildChoiceButtons();

    this.paintOrderButtons(ORDER.DEFEND);
  }

  safeBindButton(button, handler) {
    if (!button) return;

    const run = (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      handler();
    };

    button.onclick = run;
    button.onpointerup = run;
    button.ontouchend = run;
  }

  bindStartMenu() {
    const difficultyButtons = document.querySelectorAll("[data-difficulty]");

    difficultyButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        this.selectedDifficulty = btn.dataset.difficulty;

        difficultyButtons.forEach(b => {
          const selected = b.dataset.difficulty === this.selectedDifficulty;
          b.classList.toggle("active", selected);
          b.classList.toggle("selected", selected);
        });
      });
    });

    this.startGameBtn.addEventListener("click", () => {
      this.startGame();
    });

    this.startGameBtn.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      this.startGame();
    });
  }

  startGame() {
    if (!this.game.started) {
      this.game.start(this.selectedDifficulty);
    }

    if (this.startMenu) {
      this.startMenu.classList.add("is-closed");
      this.startMenu.hidden = true;
      this.startMenu.style.display = "none";
      this.startMenu.style.pointerEvents = "none";
      this.startMenu.remove();
      this.startMenu = null;
    }

    if (this.choiceOverlay && !this.game.factionChoicePending) {
      this.choiceOverlay.classList.add("is-closed");
      this.choiceOverlay.hidden = true;
      this.choiceOverlay.style.display = "none";
      this.choiceOverlay.style.pointerEvents = "none";
    }

    this.forceOrder(ORDER.DEFEND);
  }

  bindOrderButtons() {
    const attack = () => {
      this.forceOrder(ORDER.ATTACK);
    };

    const defend = () => {
      this.forceOrder(ORDER.DEFEND);
    };

    // Direkt på knapparna
    this.attackBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      attack();
    });

    this.defendBtn.addEventListener("click", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      defend();
    });

    this.attackBtn.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      attack();
    });

    this.defendBtn.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      defend();
    });

    this.attackBtn.addEventListener("touchstart", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      attack();
    }, { passive: false });

    this.defendBtn.addEventListener("touchstart", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      defend();
    }, { passive: false });

    // Global fallback: om något child-element eller lager stör
    document.addEventListener("pointerdown", (ev) => {
      const attackTarget = ev.target.closest?.("#attackBtn");
      const defendTarget = ev.target.closest?.("#defendBtn");

      if (attackTarget) {
        ev.preventDefault();
        ev.stopPropagation();
        attack();
      }

      if (defendTarget) {
        ev.preventDefault();
        ev.stopPropagation();
        defend();
      }
    }, true);
  }

  forceOrder(order) {
    this.game.order = order;

    for (const u of this.game.units) {
      if (u.team === "player") {
        u.order = order;
      }
    }

    this.paintOrderButtons(order);
  }

  applyUiSkin() {
    const root = document.documentElement;
    const frame = getImage("buttonFrame");
    const active = getImage("buttonFrameActive");
    const locked = getImage("buttonFrameLocked");
    const card = getImage("cardFrame");
    const panel = getImage("panelFrame");

    if (frame) root.style.setProperty("--frame-img", `url(${frame.src})`);
    if (active) root.style.setProperty("--frame-active-img", `url(${active.src})`);
    if (locked) root.style.setProperty("--frame-locked-img", `url(${locked.src})`);
    if (card) root.style.setProperty("--card-frame-img", `url(${card.src})`);
    if (panel) root.style.setProperty("--panel-frame-img", `url(${panel.src})`);

    if (frame) document.querySelectorAll("button").forEach(b => b.classList.add("has-frame"));
    document.querySelectorAll(".choiceCard").forEach(c => c.classList.toggle("has-card-frame", !!card));
    document.querySelectorAll(".bottomPanel").forEach(p => p.classList.toggle("has-panel-frame", !!panel));

    document.querySelectorAll("[data-difficulty]").forEach(b => {
      const selected = b.dataset.difficulty === this.selectedDifficulty;
      b.classList.toggle("active", selected);
      b.classList.toggle("selected", selected);
    });
  }

  iconHtml(iconKey, fallbackText = "") {
    const img = getImage(iconKey);
    if (!img) return fallbackText;
    return `<img class="uiIcon" src="${img.src}" alt="">`;
  }

  setOrder(order, force = false) {
    if (!force && this.game.factionChoicePending) return;
    this.forceOrder(order);
  }

  paintOrderButtons(order) {
    this.attackBtn.classList.toggle("active", order === ORDER.ATTACK);
    this.defendBtn.classList.toggle("active", order === ORDER.DEFEND);
    this.attackBtn.classList.toggle("selected", order === ORDER.ATTACK);
    this.defendBtn.classList.toggle("selected", order === ORDER.DEFEND);
  }

  buildFactionButtons() {
    this.factionButtons.innerHTML = "";

    this.game.availableFactions.forEach((key) => {
      const b = document.createElement("button");
      b.innerHTML = `<span class="iconRow">${this.iconHtml(getFactionIconKey(key))}<span>${this.displayFactionName(key)}</span></span>`;

      this.safeBindButton(b, () => {
        this.game.setFaction(key);
        this.buildFactionButtons();
        this.buildUnitButtons();
      });

      b.classList.toggle("active", key === this.game.factionKey);
      b.classList.toggle("selected", key === this.game.factionKey);
      this.factionButtons.appendChild(b);
    });

    this.applyUiSkin();
  }

  displayFactionName(key) {
    const names = {
      shadow: "Assassin",
      arcane: "Arcane Mage",
      shaolin: "Shaolin",
      ironhoof: "Ironhoof",
      stormflock: "Stormflock",
      standard: "Standard"
    };
    return names[key] || FACTIONS[key]?.name || key;
  }

  buildChoiceButtons() {
    this.choiceButtons.innerHTML = "";

    this.game.factionChoiceOptions.forEach((key) => {
      const b = document.createElement("button");
      b.innerHTML = `${this.iconHtml(getFactionIconKey(key))}<span>${this.displayFactionName(key)}</span><small>${this.describeFaction(key)}</small>`;

      this.safeBindButton(b, () => {
        if (this.game.chooseExtraFaction(key)) {
          this.choiceOverlay.classList.add("is-closed");
          this.choiceOverlay.hidden = true;
          this.choiceOverlay.style.display = "none";
          this.choiceOverlay.style.pointerEvents = "none";
          this.buildFactionButtons();
          this.buildUnitButtons();
          this.setOrder(ORDER.DEFEND, true);
          this.update();
        }
      });

      this.choiceButtons.appendChild(b);
    });

    this.applyUiSkin();
  }

  describeFaction(key) {
    const text = {
      shadow: "burst / ninja / assassins",
      arcane: "range / orbs / storm magic",
      shaolin: "control / monks / Woolkong",
      ironhoof: "tanks / armor / shield wall",
      stormflock: "lightning / chaos / burst"
    };
    return text[key] || "extra faction";
  }

  buildUnitButtons() {
    this.unitButtons.innerHTML = "";

    const faction = FACTIONS[this.game.factionKey];
    faction.units.forEach((u, i) => {
      const b = document.createElement("button");
      b.classList.add("unitButton");

      const unlock = this.game.getUnitUnlockLevel(this.game.factionKey, i);
      b.innerHTML = `<span class="iconRow">${this.iconHtml(getUnitIconKey(u.key))}<span>${u.name}</span></span><small>${u.cost}g · ${u.role}</small><small class="lockedHint">Unlock lvl ${unlock}</small>`;

      this.safeBindButton(b, () => {
        this.game.spawnPlayerUnit(i);
      });

      this.unitButtons.appendChild(b);
    });

    this.applyUiSkin();
  }

  update() {
    this.gold.textContent = Math.floor(this.game.gold);
    this.level.textContent = this.game.level;
    this.aiLevel.textContent = this.game.aiLevel;
    this.xp.textContent = `${Math.floor(this.game.xp)}/${Math.floor(this.game.xpNeededForNextLevel())}`;
    this.wave.textContent = this.game.wave;
    this.factionName.textContent = this.displayFactionName(this.game.factionKey);

    const count = this.game.units.filter(u => u.team === "player").length;
    this.unitCap.textContent = `${count}/${CONFIG.unitCap}`;

    if (this.factionButtons.children.length !== this.game.availableFactions.length) {
      this.buildFactionButtons();
    }

    const currentFaction = FACTIONS[this.game.factionKey];
    if (this.unitButtons.children.length !== currentFaction.units.length) {
      this.buildUnitButtons();
    }

    [...this.unitButtons.children].forEach((b, i) => {
      const u = currentFaction.units[i];
      const locked = !this.game.isUnitUnlocked(this.game.factionKey, i);

      b.disabled =
        !this.game.started ||
        locked ||
        this.game.factionChoicePending ||
        this.game.gold < u.cost ||
        count >= CONFIG.unitCap;

      b.classList.toggle("active", !locked && this.game.gold >= u.cost);
    });

    if (this.game.factionChoicePending) {
      this.choiceOverlay.classList.remove("is-closed");
      this.choiceOverlay.hidden = false;
      this.choiceOverlay.style.display = "grid";
      this.choiceOverlay.style.pointerEvents = "auto";
      this.buildChoiceButtons();
    } else {
      this.choiceOverlay.classList.add("is-closed");
      this.choiceOverlay.hidden = true;
      this.choiceOverlay.style.display = "none";
      this.choiceOverlay.style.pointerEvents = "none";
    }

    this.paintOrderButtons(this.game.order);

    if (this.game.gameOver) {
      this.message.style.display = "block";
      this.message.textContent = this.game.gameOver;
    }
  }
}
