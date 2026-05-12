function getClassAbilities(){
  return CLASS_ABILITIES[game.player.classPath] || [];
}

function getUnlockedAbilities(){
  return getClassAbilities().filter(a => game.player.level >= a.level);
}

function getAbilityById(id){
  return getClassAbilities().find(a => a.id === id);
}

function reduceCooldowns(){
  const cds = game.player.cooldowns || {};

  Object.keys(cds).forEach(key => {
    cds[key] = Math.max(0, cds[key] - 1);
  });
}

function rewardAfterWin(){
  xp(currentEnemy.xp || 60);

  if(game.difficulty === "easy") heal(30);
  else if(game.difficulty === "normal") heal(15);
  else if(game.difficulty === "hard") heal(5);
}

function finishCombat(){
  const nextScene = afterCombat;

  currentEnemy = null;
  afterCombat = null;

  $("combatBox").classList.add("hidden");
  $("combatBox").innerHTML = "";

  show(nextScene);
}

function useAbility(abilityId){
  if(!currentEnemy) return;

  const p = game.player;
  const a = getAbilityById(abilityId);

  if(!a){
    log("Ability saknas.");
    return;
  }

  if(p.level < a.level){
    log(`${a.name} kräver level ${a.level}.`);
    renderCombat();
    render();
    return;
  }

  const cd = p.cooldowns?.[a.id] || 0;

  if(cd > 0){
    log(`${a.name} har cooldown ${cd} tur(er) kvar.`);
    renderCombat();
    render();
    return;
  }

  if(p.mana < a.mana){
    log("Inte tillräckligt med mana.");
    renderCombat();
    render();
    return;
  }

  p.mana -= a.mana;

  if(a.void){
    p.morality += a.void;
  }

  const d = roll(20);
  const total = d + p.stats[a.stat] + p.level + a.bonus;

  if(total >= currentEnemy.dc){
    let damage = roll(a.dice) + p.level * 3 + p.stats[a.stat] * 2 + a.bonus;

    if(d === 20){
      damage *= 2;
      log(`${a.name} gör en KRITISK träff!`);
    }

    currentEnemy.hp -= damage;
    log(`${a.name}: ${total} träffar för ${damage}.`);

    if(a.shield){
      p.hp = clamp(p.hp + a.shield, 0, p.maxHp);
      log(`${a.name} skyddar dig för ${a.shield} HP.`);
    }
  } else {
    log(`${a.name}: ${total} missar.`);
  }

  if(a.cooldown > 0){
    p.cooldowns[a.id] = a.cooldown;
  }

  if(currentEnemy.hp <= 0){
    rewardAfterWin();
    finishCombat();
    return;
  }

  enemyTurn();
  reduceCooldowns();

  if(currentEnemy){
    renderCombat();
    render();
  }
}

function useCompanionCombo(){
  if(!currentEnemy) return;

  const p = game.player;
  const cost = 18;

  if(p.mana < cost){
    log("Inte tillräckligt med mana för companion combo.");
    renderCombat();
    render();
    return;
  }

  p.mana -= cost;

  const d = roll(20);
  const total = d + p.stats.leadership + p.level + p.trust.genz + p.trust.arcade + 6;

  if(total >= currentEnemy.dc){
    let damage = roll(14) + p.level * 4 + p.trust.genz + p.trust.arcade + 8;

    if(d === 20){
      damage *= 2;
      log("Genz + Arcade gör en KRITISK combo!");
    }

    currentEnemy.hp -= damage;
    log(`Genz + Arcade combo: ${total} träffar för ${damage}.`);
  } else {
    log(`Genz + Arcade combo: ${total} missar.`);
  }

  if(currentEnemy.hp <= 0){
    rewardAfterWin();
    finishCombat();
    return;
  }

  enemyTurn();
  reduceCooldowns();

  if(currentEnemy){
    renderCombat();
    render();
  }
}

window.getClassAbilities = getClassAbilities;
window.getUnlockedAbilities = getUnlockedAbilities;
window.getAbilityById = getAbilityById;
window.reduceCooldowns = reduceCooldowns;
window.rewardAfterWin = rewardAfterWin;
window.finishCombat = finishCombat;
window.useAbility = useAbility;
window.useCompanionCombo = useCompanionCombo;