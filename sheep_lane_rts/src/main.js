import { loadImages } from "./assets.js";
import { Game } from "./game.js";
import { Renderer } from "./render.js";
import { UI } from "./ui.js";
import { ORDER } from "./config.js";

const canvas = document.getElementById("game");

await loadImages();

const game = new Game();
const renderer = new Renderer(canvas, game);
const ui = new UI(game);

let selectedDifficulty = "normal";

function paintDifficulty() {
  document.querySelectorAll("[data-difficulty]").forEach((btn) => {
    const selected = btn.dataset.difficulty === selectedDifficulty;
    btn.classList.toggle("active", selected);
    btn.classList.toggle("selected", selected);
  });
}

function closeStartMenu() {
  const startMenu = document.getElementById("startMenu");

  if (!startMenu) return;

  startMenu.classList.add("is-closed");
  startMenu.hidden = true;
  startMenu.style.display = "none";
  startMenu.style.visibility = "hidden";
  startMenu.style.opacity = "0";
  startMenu.style.pointerEvents = "none";
}

function startGame() {
  console.log("START GAME CLICKED");

  if (!game.started) {
    game.start(selectedDifficulty);
  }

  closeStartMenu();

  game.setOrder(ORDER.DEFEND);
  ui.paintOrderButtons(ORDER.DEFEND);
}

document.querySelectorAll("[data-difficulty]").forEach((btn) => {
  btn.addEventListener("click", (ev) => {
    ev.preventDefault();

    selectedDifficulty = btn.dataset.difficulty || "normal";
    ui.selectedDifficulty = selectedDifficulty;

    paintDifficulty();
  });
});

const startButton = document.getElementById("startGameBtn");
const restartBtn = document.getElementById("restartBtn");
  const backMenuBtn = document.getElementById("backMenuBtn");

if (startButton) {
  startButton.addEventListener("click", (ev) => {
    ev.preventDefault();
    startGame();
  });
}
if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    location.reload();
  });
}

if (backMenuBtn) {
  backMenuBtn.addEventListener("click", () => {
    location.reload();
  });
}

window.addEventListener("keydown", (ev) => {
  if (ev.key === "Enter") {
    startGame();
  }
});

window.startSheepGame = startGame;

window.selectSheepDifficulty = (difficulty) => {
  selectedDifficulty = difficulty || "normal";
  ui.selectedDifficulty = selectedDifficulty;
  paintDifficulty();
};

paintDifficulty();

let last = performance.now();

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  game.update(dt);
  renderer.render();
  ui.update();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);