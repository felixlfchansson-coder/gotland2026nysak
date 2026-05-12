function getDifficulty(){
  return DIFFICULTY_SETTINGS[game.difficulty || "normal"] || DIFFICULTY_SETTINGS.normal;
}

function scaleEnemy(enemy){
  const diff = getDifficulty();
  const scaled = structuredClone(enemy);

  scaled.maxHp = Math.max(1, Math.round(enemy.maxHp * diff.hp));
  scaled.hp = scaled.maxHp;
  scaled.dc = Math.max(2, enemy.dc + diff.dc);
  scaled.atk = Math.max(0, enemy.atk + diff.atk);
  scaled.damageBonus = diff.damage;
  scaled.xp = Math.round((enemy.xp || 50) * diff.xp);

  return scaled;
}