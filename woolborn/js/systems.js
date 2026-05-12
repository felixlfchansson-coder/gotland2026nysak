function showStartMenu(){
  $("startMenu").classList.remove("hidden");
  $("gameLayout").classList.add("hidden");
  document.body.classList.remove("theme-assassin", "theme-mage", "theme-shaolin");
}

function showGameLayout(){
  $("startMenu").classList.add("hidden");
  $("gameLayout").classList.remove("hidden");
}

function startNewGame(difficulty){
  game = structuredClone(START_GAME);
  game.difficulty = difficulty || "normal";

  currentEnemy = null;
  afterCombat = null;

  log("Svårighetsgrad: " + getDifficulty().label);

  showGameLayout();
  show("intro");
}

function show(sceneId){
  const scene = scenes[sceneId];

  if(!scene){
    $("chapterLabel").textContent = "Fel";
    $("story").innerHTML = `Saknad scen: ${sceneId}`;
    $("choices").innerHTML = "";
    render();
    return;
  }

  game.scene = sceneId;
  applyTheme();
  currentEnemy = null;
  afterCombat = null;

  if(scene.onEnter) scene.onEnter();

  $("chapterLabel").textContent = scene.chapter || "";
  $("story").innerHTML = scene.text || "";
  $("choices").innerHTML = "";
  $("combatBox").classList.add("hidden");
  $("combatBox").innerHTML = "";

  for(const choice of scene.choices || []){
    if(choice.condition && !choice.condition()) continue;

    const button = document.createElement("button");
    button.className = "choice";
    button.textContent = choice.text;

    button.onclick = () => {
      if(choice.effect) choice.effect();

      if(currentEnemy){
        render();
        renderCombat();
        return;
      }

      if(choice.check){
        const result = doCheck(choice.check.stat, choice.check.dc);
        show(result.success ? choice.success : choice.fail);
        return;
      }

      if(choice.next){
        show(choice.next);
      }

      render();
    };

    $("choices").appendChild(button);
  }

  render();
}

function startCombat(enemy, winScene){
  if(!enemy){
    console.error("Enemy saknas i startCombat.");
    return;
  }

  if(!winScene){
    console.error("winScene saknas i startCombat för:", enemy.name);
    return;
  }

  currentEnemy = scaleEnemy(enemy);
  afterCombat = winScene;

  $("story").innerHTML = `Striden börjar mot <strong>${currentEnemy.name}</strong>.`;
  $("combatBox").classList.remove("hidden");
  $("choices").innerHTML = "";

  render();
  renderCombat();
}

function calcAttack(kind){
  if(kind === "rest"){
    const p = game.player;
    p.mana = clamp(p.mana + 18, 0, p.maxMana);
    p.hp = clamp(p.hp + 12, 0, p.maxHp);
    log("Du tar ett kort andetag och återhämtar dig lite.");
    enemyTurn();
    reduceCooldowns();

    if(currentEnemy){
      renderCombat();
      render();
    }

    return;
  }

  const unlocked = getUnlockedAbilities();

  if(kind === "normal"){
    useAbility(unlocked[0]?.id);
    return;
  }

  if(kind === "tech"){
    useAbility(unlocked[1]?.id || unlocked[0]?.id);
    return;
  }

  if(kind === "class"){
    useAbility(unlocked[2]?.id || unlocked[1]?.id || unlocked[0]?.id);
    return;
  }

  if(kind === "ultimate"){
    useAbility(unlocked[3]?.id || unlocked[2]?.id || unlocked[1]?.id || unlocked[0]?.id);
    return;
  }

  if(kind === "combo"){
    useCompanionCombo();
  }
}

function enemyTurn(){
  if(!currentEnemy) return;

  const p = game.player;
  const d = roll(20);

  const playerDefense = 8 + Math.floor(p.level / 4);
  const total = d + currentEnemy.atk;

  if(d === 20 || total >= playerDefense){
    let damage = roll(currentEnemy.die || 8)
      + currentEnemy.atk
      + (currentEnemy.damageBonus || 0);

    if(d === 20){
      damage *= 2;
      log(`${currentEnemy.name} gör en KRITISK träff!`);
    }

    damage = Math.max(1, damage);
    p.hp -= damage;

    log(`${currentEnemy.name} träffar med ${total} och gör ${damage} skada.`);
  } else {
    log(`${currentEnemy.name} missar med ${total} mot försvar ${playerDefense}.`);
  }

  if(p.hp <= 0){
    p.hp = 0;
    currentEnemy = null;
    afterCombat = null;

    $("combatBox").classList.add("hidden");
    $("combatBox").innerHTML = "";

    show("game_over");
    return;
  }
}

function saveGame(){
  localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  log("Spelet sparades.");
  render();
}

function loadGame(){
  const data = localStorage.getItem(SAVE_KEY);

  if(!data){
    log("Ingen sparfil hittades.");
    render();
    return;
  }

  game = JSON.parse(data);
  currentEnemy = null;
  afterCombat = null;
  log("Spelet laddades.");
  showGameLayout();
  applyTheme();
  show(game.scene && game.scene !== "menu" ? game.scene : "intro");
}

function resetGame(){
  localStorage.removeItem(SAVE_KEY);
  game = structuredClone(START_GAME);
  currentEnemy = null;
  afterCombat = null;
  showStartMenu();
  render();
}
window.showStartMenu = showStartMenu;
window.showGameLayout = showGameLayout;
window.startNewGame = startNewGame;
window.show = show;
window.startCombat = startCombat;
window.calcAttack = calcAttack;
window.enemyTurn = enemyTurn;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.resetGame = resetGame;