const factText = document.getElementById("factText");
const factButton = document.getElementById("newFactButton");
const sheepButton = document.getElementById("sheepButton");
const speechBubble = document.getElementById("speechBubble");

const classroom = document.body.dataset.classroom;

const sheepLines = [
  "Det här kommer hålla dig vaken.",
  "Svaret är kanske värre än frågan.",
  "Tänk långsamt. Det gör ont snabbare annars.",
  "Du behövde egentligen inte veta detta.",
  "En tanke kan vara en dörr. Tyvärr."
];

async function loadFacts() {
  const response = await fetch("data/fakta_structured.json");
  const data = await response.json();

  const facts = data[classroom].facts;

  factButton.addEventListener("click", () => {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    factText.textContent = randomFact;
  });
}

sheepButton.addEventListener("click", () => {
  const randomLine = sheepLines[Math.floor(Math.random() * sheepLines.length)];

  speechBubble.textContent = randomLine;
  speechBubble.classList.add("show");

  setTimeout(() => {
    speechBubble.classList.remove("show");
  }, 5000);
});

loadFacts();