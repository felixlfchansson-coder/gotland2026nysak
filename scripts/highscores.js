function getClient() {
  return window.supabaseClient || window.db || null;
}

export async function submitHighscore({
  game,
  category,
  score,
  extraData = {}
}) {
  const db = getClient();
  if (!db) return;

  const {
    data: { user }
  } = await db.auth.getUser();

  if (!user) return;

  const username =
    localStorage.getItem("userName") ||
    user.email ||
    "Unknown Sheep";

  const { error } = await db
    .from("highscores")
    .insert({
      user_id: user.id,
      username,
      game,
      category,
      score,
      extra_data: extraData
    });

  if (error) {
    console.error("Highscore submit error:", error);
  }
}

export async function getHighscores({
  game,
  category,
  ascending = false,
  limit = 10
}) {
  const db = getClient();
  if (!db) return [];

  const { data, error } = await db
    .from("highscores")
    .select("username, score, extra_data, created_at")
    .eq("game", game)
    .eq("category", category)
    .order("score", { ascending })
    .limit(limit);

  if (error) {
    console.error("Highscore load error:", error);
    return [];
  }

  return data || [];
}