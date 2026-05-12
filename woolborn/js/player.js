
function has(itemName){
  return game.player.inventory.includes(itemName);
}


function quest(name){
  if(!game.player.quests.includes(name) && !game.player.completed.includes(name)){
    game.player.quests.push(name);
    log("Quest: " + name);
  }
}

function complete(name){
  game.player.quests = game.player.quests.filter(q => q !== name);
  if(!game.player.completed.includes(name)){
    game.player.completed.push(name);
    log("Avklarat: " + name);
  }
}

function stat(name, amount){
  game.player.stats[name] += amount;
  log(`${name} ${amount >= 0 ? "+" : ""}${amount}`);
}

function item(name){
  if(!game.player.inventory.includes(name)){
    game.player.inventory.push(name);
    log("Item: " + name);
  }
}

function ability(name){
  if(!game.player.abilities.includes(name)){
    game.player.abilities.push(name);
    log("Ability: " + name);
  }
}

function xp(amount){
  const p = game.player;
  p.xp += amount;
  log("+" + amount + " XP");

  while(p.xp >= p.level * 100){
    p.xp -= p.level * 100;
    p.level += 1;
    p.maxHp += 18;
    p.maxMana += 12;
    p.hp = p.maxHp;
    p.mana = p.maxMana;
    log("Level up! Level " + p.level);
  }
}

function heal(amount = 999){
  const p = game.player;
  p.hp = clamp(p.hp + amount, 0, p.maxHp);
  p.mana = clamp(p.mana + Math.floor(amount / 2), 0, p.maxMana);
  log("Du återhämtar dig.");
}

function setPath(path){
  const p = game.player;
  p.classPath = path;

  if(path === "Assassin"){
    p.faction = "Assassinfalangen";
    p.companions.genz.path = "Mage";
    p.companions.arcade.path = "Shaolin";
  }

  if(path === "Mage"){
    p.faction = "Magifalangen";
    p.companions.genz.path = "Assassin";
    p.companions.arcade.path = "Shaolin";
  }

  if(path === "Shaolin"){
    p.faction = "Shaolintemplet";
    p.companions.genz.path = "Mage";
    p.companions.arcade.path = "Assassin";
  }

  log("Väg vald: " + path);
  applyTheme();
}

function lockSubclass(){
  const p = game.player;
  const s = p.stats;

  if(p.classPath === "Assassin"){
    if(s.wisdom >= 3) p.subclass = "Shadow Mage";
    else if(s.courage >= 3) p.subclass = "Shadow Warrior";
    else p.subclass = "Shadow Assassin";
  }

  if(p.classPath === "Mage"){
    if(s.courage >= 3) p.subclass = "Fire Mage";
    else if(s.stealth >= 3) p.subclass = "Water Mage";
    else p.subclass = "Arcane Mage";
  }

  if(p.classPath === "Shaolin"){
    if(s.stealth >= 3) p.subclass = "Shaolin Ninja";
    else if(s.wisdom >= 3) p.subclass = "Shaolin Enlightened Paladin";
    else p.subclass = "Shaolin Dragon Warrior";
  }

  p.companions.genz.subclass =
    p.companions.genz.path === "Mage" ? "Arcane Mage" :
    p.companions.genz.path === "Assassin" ? "Shadow Assassin" :
    "Shaolin Enlightened Paladin";

  p.companions.arcade.subclass =
    p.companions.arcade.path === "Shaolin" ? "Shaolin Dragon Warrior" :
    p.companions.arcade.path === "Assassin" ? "Shaolin Ninja" :
    "Fire Mage";

  log("Subklass: " + p.subclass);
}

function grantStarterAbility(){
  const p = game.player;

  if(p.flags.starterAbilityGiven) return;
  p.flags.starterAbilityGiven = true;

  if(p.classPath === "Assassin"){
    ability("Quick Slash");
    item("Nattdolk");
  }

  if(p.classPath === "Mage"){
    ability("Mana Bolt");
    item("Lärlingsstav");
  }

  if(p.classPath === "Shaolin"){
    ability("Palm Strike");
    item("Träningsstav");
  }
}

function classReward(){
  const p = game.player;

  if(p.flags.classRewardGiven) return;
  p.flags.classRewardGiven = true;

  if(p.classPath === "Assassin"){
    ability("Shadow Step");
    item("Förbjuden Scroll: Susano");
    log("Susano-scrollen är hittad, men kräver level 7 för att bemästras.");
    p.morality += 1;
  }

  if(p.classPath === "Mage"){
    ability("Elemental Burst");
    item("Enhörningskristall");
    log("Enhörningen väcker din mana. Större magi låses upp senare.");
  }

  if(p.classPath === "Shaolin"){
    ability("Chi Burst");
    item("Woolkongs Sigill");
    log("Woolkong lär dig grunden. Dragon Fist kräver level 4.");
  }

  xp(80);
  heal(60);
}

function doCheck(statName, dc){
  const p = game.player;
  const d = roll(20);
  const total = d + (p.stats[statName] || 0) + Math.floor(p.level / 2);
  const success = total >= dc;

  log(`${statName} check: d20(${d}) = ${total} mot DC ${dc}. ${success ? "Lyckades" : "Misslyckades"}`);

  return { success, total, dice: d };
}