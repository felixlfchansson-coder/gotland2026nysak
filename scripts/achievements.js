export const ACHIEVEMENTS = {
  flyktmastare: {
    id: "flyktmastare",
    title: "Flyktmästare",
    description: "Fly från hagen.",
    image: "images/achievements/flyktmastare.png",
    fallback: "images/achievements/fallback.png",
  },

  snabb_far: {
    id: "snabb_far",
    title: "Snabb Får",
    description: "Flydde på 5 dagar eller mindre.",
    image: "images/achievements/snabb-far.png",
    fallback: "images/achievements/fallback.png",
  },

  sheep_line_clear: {
    id: "sheep_line_clear",
    title: "SheepLine Clear",
    description: "Klara SheepLine.",
    image: "images/achievements/sheep-line-clear.png",
    fallback: "images/achievements/fallback.png",
  },

  sheep_line_hard: {
    id: "sheep_line_hard",
    title: "SheepLine Hard",
    description: "Klara SheepLine på Hard.",
    image: "images/achievements/sheep-line-hard.png",
    fallback: "images/achievements/fallback.png",
  },

  sheep_line_insane: {
    id: "sheep_line_insane",
    title: "SheepLine Insane",
    description: "Klara SheepLine på Insane.",
    image: "images/achievements/sheep-line-insane.png",
    fallback: "images/achievements/fallback.png",
  },

  woolborn_clear: {
    id: "woolborn_clear",
    title: "Woolborn",
    description: "Klara Woolborn.",
    image: "images/achievements/woolborn-clear.png",
    fallback: "images/achievements/fallback.png",
  },

  woolborn_hard: {
    id: "woolborn_hard",
    title: "Woolborn Hard",
    description: "Klara Woolborn på Hard.",
    image: "images/achievements/woolborn-hard.png",
    fallback: "images/achievements/fallback.png",
  },

  woolborn_insane: {
    id: "woolborn_insane",
    title: "Woolborn Insane",
    description: "Klara Woolborn på Insane.",
    image: "images/achievements/woolborn-insane.png",
    fallback: "images/achievements/fallback.png",
  },

  storm_master: {
    id: "storm_master",
    title: "Storm Master",
    description: "Lås upp Stormfolk.",
    image: "images/achievements/storm-master.png",
    fallback: "images/achievements/fallback.png",
  },

  susano_shadow: {
    id: "susano_shadow",
    title: "Susano Shadow",
    description: "Lås upp Susano.",
    image: "images/achievements/susano-shadow.png",
    fallback: "images/achievements/fallback.png",
  },

  woolkong_king: {
    id: "woolkong_king",
    title: "Woolkong King",
    description: "Lås upp Woolkong.",
    image: "images/achievements/woolkong-king.png",
    fallback: "images/achievements/fallback.png",
  },

  lore_reader: {
    id: "lore_reader",
    title: "Lore Reader",
    description: "Läs all lore.",
    image: "images/achievements/lore-reader.png",
    fallback: "images/achievements/fallback.png",
  },

  quiz_master: {
    id: "quiz_master",
    title: "Quizmästare",
    description: "Få alla rätt på quiz.",
    image: "images/achievements/quiz-master.png",
    fallback: "images/achievements/fallback.png",
  },

  token_collector: {
    id: "token_collector",
    title: "Token Collector",
    description: "Lås upp 10 tokens.",
    image: "images/achievements/token-collector.png",
    fallback: "images/achievements/fallback.png",
  },

  godfar: {
    id: "godfar",
    title: "Gudafåret",
    description: "Lås upp alla achievements.",
    image: "images/achievements/godfar.png",
    fallback: "images/achievements/fallback.png",
  }
};

export function getUnlockedAchievements() {
  return JSON.parse(
    localStorage.getItem("unlockedAchievements") || "[]"
  );
}

export function hasAchievement(id) {
  return getUnlockedAchievements().includes(id);
}

export function unlockAchievement(id) {
  const unlocked = getUnlockedAchievements();

  if (!unlocked.includes(id)) {
    unlocked.push(id);

    localStorage.setItem(
      "unlockedAchievements",
      JSON.stringify(unlocked)
    );

    console.log("Achievement unlocked:", id);
  }
}

export function lockAchievement(id) {
  const unlocked = getUnlockedAchievements()
    .filter(a => a !== id);

  localStorage.setItem(
    "unlockedAchievements",
    JSON.stringify(unlocked)
  );
}

export function clearAchievements() {
  localStorage.removeItem("unlockedAchievements");
}