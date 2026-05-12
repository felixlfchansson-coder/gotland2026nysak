
function render(){
  const p = game.player;

  $("playerCard").innerHTML = `
    <div class="card">
      <strong>${p.name}</strong><br>
      <span class="badge">Level ${p.level}</span>
      <span class="badge">${getDifficulty().label}</span>
      <span class="badge">${p.classPath || "Ovald väg"}</span>
      <span class="badge">${p.subclass || "Ingen subklass"}</span>
      <span class="badge">${p.faction || "Ingen falang"}</span>

      <div class="bar"><div class="fill" style="width:${p.hp / p.maxHp * 100}%"></div></div>
      HP ${p.hp}/${p.maxHp}

      <div class="bar"><div class="fill" style="width:${p.mana / p.maxMana * 100}%"></div></div>
      Mana ${p.mana}/${p.maxMana}

      <div class="bar"><div class="fill" style="width:${p.xp / (p.level * 100) * 100}%"></div></div>
      XP ${p.xp}/${p.level * 100}
    </div>
  `;

  $("stats").innerHTML =
    Object.entries(p.stats)
      .map(([k, v]) => `<div class="stat-row"><span>${k}</span><strong>${v}</strong></div>`)
      .join("") +
    `<div class="stat-row"><span>void</span><strong>${p.morality}</strong></div>` +
    `<div class="stat-row"><span>dragon trust</span><strong>${p.trust.dragon}</strong></div>`;

  $("companions").innerHTML = `
    <div class="comp-row"><span>Genz</span><strong>${p.companions.genz.subclass || p.companions.genz.path || "?"}</strong></div>
    <div class="comp-row"><span>Arcade</span><strong>${p.companions.arcade.subclass || p.companions.arcade.path || "?"}</strong></div>
    <div class="comp-row"><span>Genz trust</span><strong>${p.trust.genz}</strong></div>
    <div class="comp-row"><span>Arcade trust</span><strong>${p.trust.arcade}</strong></div>
  `;

  const abilityList = getClassAbilities();

  $("abilities").innerHTML = abilityList.length
    ? abilityList.map(a => {
        const unlocked = p.level >= a.level;
        const cd = p.cooldowns?.[a.id] || 0;
        return `<li class="${unlocked ? "" : "ability-locked"}">
          ${unlocked ? "✓" : "🔒"} ${a.name} 
          <span class="small">lvl ${a.level}, mana ${a.mana}</span>
          ${cd > 0 ? `<span class="cooldown-pill">CD ${cd}</span>` : ""}
        </li>`;
      }).join("")
    : "<li>Välj en väg för att se abilities.</li>";

  $("inventory").innerHTML = p.inventory.length
    ? p.inventory.map(i => `<li>${i}</li>`).join("")
    : "<li>Tomt</li>";

  $("questlog").innerHTML = [
    ...p.quests.map(q => `<div>◆ ${q}</div>`),
    ...p.completed.slice(-6).map(q => `<div class="good">✓ ${q}</div>`)
  ].join("") || "<div>Inga aktiva quests</div>";

  $("log").innerHTML = game.log.map(l => `<div>• ${l}</div>`).join("");
}


function renderCombat(){
  if(!currentEnemy){
    $("combatBox").classList.add("hidden");
    $("combatBox").innerHTML = "";
    return;
  }

  const percent = clamp(currentEnemy.hp / currentEnemy.maxHp * 100, 0, 100);
  const unlocked = getUnlockedAbilities();
  const all = getClassAbilities();

  const buttonFor = (slot, fallbackText) => {
    const ability = unlocked[slot];

    if(!ability){
      const locked = all[slot];
      return `<button disabled class="ability-locked">${locked ? "🔒 " + locked.name + " lvl " + locked.level : fallbackText}</button>`;
    }

    const cd = game.player.cooldowns?.[ability.id] || 0;
    const extra = cd > 0 ? ` CD ${cd}` : "";

    return `<button onclick="useAbility('${ability.id}')">${ability.name} · ${ability.mana} mana${extra}</button>`;
  };

  $("combatBox").classList.remove("hidden");
  $("combatBox").innerHTML = `
    <div class="combat-title">${currentEnemy.name}</div>
    <p class="small">${currentEnemy.desc}</p>

    <div class="bar">
      <div class="fill enemy-fill" style="width:${percent}%"></div>
    </div>

    <p>Fiende-HP: ${Math.max(0, currentEnemy.hp)} / ${currentEnemy.maxHp}</p>

    <div class="combat-actions">
      ${buttonFor(0, "Basic")}
      ${buttonFor(1, "Teknik")}
      ${buttonFor(2, "Klasskraft")}
      ${buttonFor(3, "Ultimate")}
      <button onclick="calcAttack('combo')">Genz + Arcade combo · 18 mana</button>
      <button onclick="calcAttack('rest')">Återhämta dig</button>
    </div>
  `;
}