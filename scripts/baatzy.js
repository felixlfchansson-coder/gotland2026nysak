const diceImages = [
  { name: "red", img: "images/baatzy/red-dice.png" },
  { name: "black", img: "images/baatzy/black-dice.png" },
  { name: "green", img: "images/baatzy/green-dice.png" },
  { name: "blue", img: "images/baatzy/blue-dice.png" },
  { name: "cream", img: "images/baatzy/cream-dice.png" }
];

const categories = [
  { id: "red", label: "Röd flock" },
  { id: "black", label: "Svart flock" },
  { id: "green", label: "Grön flock" },
  { id: "blue", label: "Blå flock" },
  { id: "cream", label: "Kräm flock" },
  { id: "pair", label: "Par" },
  { id: "twoPair", label: "Två par" },
  { id: "three", label: "Triss" },
  { id: "four", label: "Fyrtal" },
  { id: "fullHouse", label: "Full fårhage" },
  { id: "small", label: "Liten flock 1–5" },
  { id: "large", label: "Stor flock 2–6" },
  { id: "baatzy", label: "BÄÄÄTZY" },
  { id: "chance", label: "Chans" }
];

let dice = [0, 0, 0, 0, 0];
let locked = [false, false, false, false, false];
let rollsLeft = 3;
let scores = {};

const diceRow = document.getElementById("diceRow");
const rollBtn = document.getElementById("rollBtn");
const rollsLeftEl = document.getElementById("rollsLeft");
const scoreBoard = document.getElementById("scoreBoard");
const totalScoreEl = document.getElementById("totalScore");

function init() {
  renderDice();
  renderScoreBoard();
  updateUI();
}

function rollDice() {
  if (rollsLeft <= 0) return;

  dice = dice.map((value, index) => {
    if (locked[index]) return value;
    return Math.floor(Math.random() * diceImages.length);
  });

  rollsLeft--;
  renderDice();
  renderScoreBoard();
  updateUI();
}

function toggleLock(index) {
  if (rollsLeft === 3) return;
  locked[index] = !locked[index];
  renderDice();
}

function renderDice() {
  diceRow.innerHTML = "";

  dice.forEach((value, index) => {
    const button = document.createElement("button");
    button.className = locked[index] ? "die locked" : "die";
    button.onclick = () => toggleLock(index);

    const img = document.createElement("img");
    img.src = diceImages[value].img;
    img.alt = diceImages[value].name;

    button.appendChild(img);
    diceRow.appendChild(button);
  });
}

function renderScoreBoard() {
  scoreBoard.innerHTML = "";

  categories.forEach(cat => {
    const row = document.createElement("button");
    row.className = "score-row";

    const used = scores[cat.id] !== undefined;
    const preview = calculateScore(cat.id);

    if (used) row.classList.add("used");
    if (!used && rollsLeft < 3) row.classList.add("preview");

    row.innerHTML = `
      <span>${cat.label}</span>
      <strong>${used ? scores[cat.id] : preview}</strong>
    `;

    row.onclick = () => chooseScore(cat.id);

    scoreBoard.appendChild(row);
  });
}

function chooseScore(categoryId) {
  if (scores[categoryId] !== undefined) return;
  if (rollsLeft === 3) return;

  scores[categoryId] = calculateScore(categoryId);
  nextRound();
}

function nextRound() {
  dice = [0, 0, 0, 0, 0];
  locked = [false, false, false, false, false];
  rollsLeft = 3;

  renderDice();
  renderScoreBoard();
  updateUI();
}

function calculateScore(categoryId) {
  const values = dice.map(v => v + 1);
  const counts = getCounts(values);
  const sum = values.reduce((a, b) => a + b, 0);

  const colorIndex = diceImages.findIndex(d => d.name === categoryId);
  if (colorIndex !== -1) {
    const number = colorIndex + 1;
    return values.filter(v => v === number).length * number;
  }

  const countValues = Object.values(counts).sort((a, b) => b - a);
  const numberValues = Object.keys(counts).map(Number).sort((a, b) => b - a);

  switch (categoryId) {
    case "pair":
      return scoreOfKind(counts, 2);
    case "twoPair":
      return scoreTwoPair(counts);
    case "three":
      return scoreOfKind(counts, 3);
    case "four":
      return scoreOfKind(counts, 4);
    case "fullHouse":
      return countValues.includes(3) && countValues.includes(2) ? sum : 0;
    case "small":
      return hasStraight(values, [1, 2, 3, 4, 5]) ? 15 : 0;
    case "large":
      return hasStraight(values, [2, 3, 4, 5, 6]) ? 20 : 0;
    case "baatzy":
      return countValues[0] === 5 ? 50 : 0;
    case "chance":
      return sum;
    default:
      return 0;
  }
}

function getCounts(values) {
  return values.reduce((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function scoreOfKind(counts, amount) {
  const matches = Object.keys(counts)
    .map(Number)
    .filter(num => counts[num] >= amount)
    .sort((a, b) => b - a);

  return matches.length ? matches[0] * amount : 0;
}

function scoreTwoPair(counts) {
  const pairs = Object.keys(counts)
    .map(Number)
    .filter(num => counts[num] >= 2)
    .sort((a, b) => b - a);

  if (pairs.length < 2) return 0;
  return pairs[0] * 2 + pairs[1] * 2;
}

function hasStraight(values, needed) {
  return needed.every(num => values.includes(num));
}

function updateUI() {
  rollsLeftEl.textContent = rollsLeft;

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  totalScoreEl.textContent = total;

  rollBtn.disabled = rollsLeft <= 0;
  rollBtn.style.opacity = rollsLeft <= 0 ? ".5" : "1";
}

rollBtn.addEventListener("click", rollDice);

init();