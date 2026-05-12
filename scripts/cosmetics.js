export const COSMETICS = {
  harry_potter: {
    id: "harry_potter",
    type: "glasses",
    title: "Harry Potter",
    unlockType: "achievement",
    requirement: "Öppna alla sidor medan du är inloggad.",
    image: "images/cosmetics/glasses/harry-potter.png",
    fallback: "images/cosmetics/fallback.png",
  },

  lee_sin: {
    id: "lee_sin",
    type: "glasses",
    title: "Lee Sin",
    unlockType: "achievement",
    requirement: "Vinn med Shaolinfalangen i SheepLine på Svår.",
    image: "images/cosmetics/glasses/lee-sin.png",
    fallback: "images/cosmetics/fallback.png",
  },

  sorting_hat: {
    id: "sorting_hat",
    type: "hat",
    title: "Sorting Hat",
    unlockType: "achievement",
    requirement: "Klara Flyhage med alla karaktärer.",
    image: "images/cosmetics/hats/sorting-hat.png",
    fallback: "images/cosmetics/fallback.png",
  },

  black_sheep: {
    id: "black_sheep",
    type: "body",
    title: "Svart",
    unlockType: "achievement",
    requirement: "Tryck på Snapes knapp 20 gånger.",
    image: "images/cosmetics/bodies/black-sheep.png",
    fallback: "images/cosmetics/fallback.png",
  },

  crimson_sheep: {
    id: "crimson_sheep",
    type: "body",
    title: "Crimson",
    unlockType: "achievement",
    requirement: "Tryck på Dad Jokes 30 gånger.",
    image: "images/cosmetics/bodies/crimson-sheep.png",
    fallback: "images/cosmetics/fallback.png",
  },

  petrol_sheep: {
    id: "petrol_sheep",
    type: "body",
    title: "Petrol",
    unlockType: "achievement",
    requirement: "Spela quizet 2 gånger.",
    image: "images/cosmetics/bodies/petrol-sheep.png",
    fallback: "images/cosmetics/fallback.png",
  },

  viridian_sheep: {
    id: "viridian_sheep",
    type: "body",
    title: "Viridian",
    unlockType: "achievement",
    requirement: "Tryck på Tidsfåret 10 gånger.",
    image: "images/cosmetics/bodies/viridian-sheep.png",
    fallback: "images/cosmetics/fallback.png",
  },
  cowboy_hat: {
  id: "cowboy_hat",
  type: "hat",
  title: "Cowboy",
  unlockType: "qr",
  requirement: "QR Unlock",
  image: "images/cosmetics/hats/cowboy.png",
  fallback: "images/cosmetics/fallback.png",
},

doffy_glasses: {
  id: "doffy_glasses",
  type: "glasses",
  title: "Doffy",
  unlockType: "qr",
  requirement: "QR Unlock",
  image: "images/cosmetics/glasses/doffy.png",
  fallback: "images/cosmetics/fallback.png",
},

strawhat: {
  id: "strawhat",
  type: "hat",
  title: "Stråhatt",
  unlockType: "qr",
  requirement: "QR Unlock",
  image: "images/cosmetics/hats/strawhat.png",
  fallback: "images/cosmetics/fallback.png",
},
};

export function getUnlockedCosmetics() {
  return JSON.parse(localStorage.getItem("unlockedCosmetics") || "[]");
}

export function hasCosmetic(id) {
  return getUnlockedCosmetics().includes(id);
}

export function unlockCosmetic(id) {
  const unlocked = getUnlockedCosmetics();

  if (!unlocked.includes(id)) {
    unlocked.push(id);
    localStorage.setItem("unlockedCosmetics", JSON.stringify(unlocked));
    console.log("Cosmetic unlocked:", id);
  }
}

export function addCounter(counterId, amount = 1) {
  const key = `cosmeticCounter_${counterId}`;
  const current = Number(localStorage.getItem(key) || 0);
  const next = current + amount;

  localStorage.setItem(key, String(next));
  checkCosmeticUnlocks();

  return next;
}

export function getCounter(counterId) {
  return Number(localStorage.getItem(`cosmeticCounter_${counterId}`) || 0);
}

export function markPageVisited(pageId) {
  const visited = JSON.parse(localStorage.getItem("visitedPages") || "[]");

  if (!visited.includes(pageId)) {
    visited.push(pageId);
    localStorage.setItem("visitedPages", JSON.stringify(visited));
  }

  checkCosmeticUnlocks();
}

export function markFlyhageCharacterWin(characterId) {
  const wins = JSON.parse(localStorage.getItem("flyhageCharacterWins") || "[]");

  if (!wins.includes(characterId)) {
    wins.push(characterId);
    localStorage.setItem("flyhageCharacterWins", JSON.stringify(wins));
  }

  checkCosmeticUnlocks();
}

export function markShaolinHardWin() {
  localStorage.setItem("shaolinHardWin", "true");
  checkCosmeticUnlocks();
}

export function markQuizPlayed() {
  addCounter("quizPlayed", 1);
}

export function checkCosmeticUnlocks() {
  const visitedPages = JSON.parse(localStorage.getItem("visitedPages") || "[]");
  const flyhageWins = JSON.parse(localStorage.getItem("flyhageCharacterWins") || "[]");

  const ALL_PAGES = [
    "index",
    "login",
    "profile",
    "token-hs",
    "flyhage",
    "quiz",
    "lore",
    "sheepline",
  ];

  const ALL_FLYHAGE_CHARACTERS = [
  "Clark Ullofsson",
  "Bäännie Clyde",
  "Sheep Houdini",
  "The Woolfather",
  "Mother Bäärisa",
  "Sheepra Winfry",
];

  if (ALL_PAGES.every(page => visitedPages.includes(page))) {
    unlockCosmetic("harry_potter");
  }

  if (localStorage.getItem("shaolinHardWin") === "true") {
    unlockCosmetic("lee_sin");
  }

  if (ALL_FLYHAGE_CHARACTERS.every(char => flyhageWins.includes(char))) {
    unlockCosmetic("sorting_hat");
  }

  if (getCounter("snapeButton") >= 20) {
    unlockCosmetic("black_sheep");
  }

  if (getCounter("dadJokes") >= 30) {
    unlockCosmetic("crimson_sheep");
  }

  if (getCounter("quizPlayed") >= 2) {
    unlockCosmetic("petrol_sheep");
  }

  if (getCounter("timeSheep") >= 10) {
    unlockCosmetic("viridian_sheep");
  }
}
const QR_CODES = {
  GOTLAND_COWBOY_2026: "cowboy_hat",
  DOFFY_SECRET_2026: "doffy_glasses",
  STRAWHAT_GOTLAND_2026: "strawhat",
};

export function unlockQRCode(code) {

  const cosmeticId = QR_CODES[code];

  if (!cosmeticId) {
    return false;
  }

  unlockCosmetic(cosmeticId);

  return cosmeticId;
}