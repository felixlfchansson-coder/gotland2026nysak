const PROGRESS_KEY = "playerProgressLoaded";

function getClient() {
  return window.supabaseClient || window.db || window.supabaseInstance || null;
}

function readJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function loadProgressFromSupabase() {
  const db = getClient();
  if (!db) return;

  const {
    data: { user }
  } = await db.auth.getUser();

  if (!user) return;

  const { data, error } = await db
    .from("player_progress")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Load progress error:", error);
    return;
  }

  if (!data) {
    await saveProgressToSupabase();
    return;
  }

  writeJSON("unlockedAchievements", data.achievements || []);
  writeJSON("unlockedCosmetics", data.cosmetics || []);
  writeJSON("cosmeticCounters", data.counters || {});
  writeJSON("equippedAvatar", data.avatar || {});

  if (data.avatar?.body) localStorage.setItem("equipped_body", data.avatar.body);
  if (data.avatar?.glasses) localStorage.setItem("equipped_glasses", data.avatar.glasses);
  if (data.avatar?.hat) localStorage.setItem("equipped_hat", data.avatar.hat);

  localStorage.setItem(PROGRESS_KEY, "true");
}

export async function saveProgressToSupabase() {
  const db = getClient();
  if (!db) return;

  const {
    data: { user }
  } = await db.auth.getUser();

  if (!user) return;

  const avatar = {
    body: localStorage.getItem("equipped_body") || "",
    glasses: localStorage.getItem("equipped_glasses") || "",
    hat: localStorage.getItem("equipped_hat") || ""
  };

  const payload = {
    user_id: user.id,
    username: localStorage.getItem("userName") || user.email,
    achievements: readJSON("unlockedAchievements", []),
    cosmetics: readJSON("unlockedCosmetics", []),
    avatar,
    counters: {
      snapeButton: Number(localStorage.getItem("cosmeticCounter_snapeButton") || 0),
      dadJokes: Number(localStorage.getItem("cosmeticCounter_dadJokes") || 0),
      quizPlayed: Number(localStorage.getItem("cosmeticCounter_quizPlayed") || 0),
      timeSheep: Number(localStorage.getItem("cosmeticCounter_timeSheep") || 0)
    },
    updated_at: new Date().toISOString()
  };

  const { error } = await db
    .from("player_progress")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    console.error("Save progress error:", error);
  }
}

export function enableAutoProgressSave() {
  const originalSetItem = localStorage.setItem;

  localStorage.setItem = function(key, value) {
    originalSetItem.apply(this, arguments);

    const shouldSync =
      key.startsWith("unlocked") ||
      key.startsWith("equipped_") ||
      key.startsWith("cosmeticCounter_");

    if (shouldSync) {
      clearTimeout(window.__progressSaveTimer);
      window.__progressSaveTimer = setTimeout(() => {
        saveProgressToSupabase();
      }, 400);
    }
  };
}