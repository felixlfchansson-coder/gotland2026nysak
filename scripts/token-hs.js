// =========================
// TOKEN / HIGHSCORE PAGE
// Demo-logik nu.
// Sen byter vi localStorage mot Supabase.
// =========================

const userName =
  localStorage.getItem("userName") ||
  localStorage.getItem("currentUser") ||
  "Spelare";

document.querySelectorAll(".player-name").forEach((el) => {
  el.textContent = userName;
});

// =========================
// DEMO: upplåsta saker
// Sen kommer detta från Supabase user_unlocks
// =========================

const unlockedItems = [
  "body_base",
  "hat_tophat",
  "glasses_sunglasses"
];

const unlockedAchievements = [
  "flyhage_escape"
];

const completedChallenges = [];

// =========================
// Apply avatar unlocks
// =========================

document.querySelectorAll("[data-unlock-id]").forEach((card) => {
  const unlockId = card.dataset.unlockId;

  if (unlockedItems.includes(unlockId)) {
    card.classList.remove("locked");
    card.classList.add("unlocked");
  } else {
    card.classList.remove("unlocked");
    card.classList.add("locked");
  }
});

// =========================
// Apply achievements
// =========================

document.querySelectorAll("[data-achievement-id]").forEach((card) => {
  const achievementId = card.dataset.achievementId;

  if (unlockedAchievements.includes(achievementId)) {
    card.classList.remove("locked");
    card.classList.add("unlocked");
  } else {
    card.classList.remove("unlocked");
    card.classList.add("locked");
  }
});

// =========================
// Apply leader challenges
// =========================

document.querySelectorAll("[data-challenge-id]").forEach((card) => {
  const challengeId = card.dataset.challengeId;

  if (completedChallenges.includes(challengeId)) {
    card.classList.remove("locked");
    card.classList.add("completed");
  }
});

// =========================
// DEMO highscores
// Sen kommer detta från Supabase highscores
// =========================

const highscores = {
  flyhage: [
    { name: "Amanda", value: "3 dagar" },
    { name: "Felix", value: "4 dagar" },
    { name: "Oscar", value: "5 dagar" }
  ],

  sheepline: [
    { name: "Easy", value: "01:12" },
    { name: "Normal", value: "02:34" },
    { name: "Hard", value: "04:55" },
    { name: "Insane", value: "08:31" }
  ],

  quiz: [
    { name: "Elsa", value: "19 poäng" },
    { name: "Amanda", value: "17 poäng" },
    { name: "Leo", value: "15 poäng" }
  ]
};

renderHighscore("flyhageHighscore", highscores.flyhage);
renderHighscore("sheeplineHighscore", highscores.sheepline);
renderHighscore("quizHighscore", highscores.quiz);

function renderHighscore(containerId, rows) {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = "";

  rows.forEach((row, index) => {
    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";

    const div = document.createElement("div");
    div.className = "score-row";

    div.innerHTML = `
      <span>${medal} ${row.name}</span>
      <strong>${row.value}</strong>
    `;

    container.appendChild(div);
  });
}