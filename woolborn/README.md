# Woolborn Fixed Full Version

Detta är en komplett fixad version av Woolborn-prototypen.

## Starta spelet

Öppna `index.html` i webbläsaren.

## Fixat i denna version

- Combat fungerar.
- Spelet fastnar inte längre i tomma combat-scener.
- `startCombat()` kräver alltid enemy + nästa scen.
- Alla combat-val använder bara `effect`, inte `next`.
- Fiender är balanserade lättare.
- Spelaren får återhämtning mellan viktiga strider.
- Det finns en "Återhämta dig"-knapp i combat.
- Save/load fungerar via localStorage.
- Alla storyvägar från intro till slut finns kvar.
- Flera slut finns kvar.

## Filstruktur

```txt
index.html
css/style.css
js/state.js
js/data.js
js/systems.js
js/scenes.js
js/app.js
```

## Ändra fiender

Öppna:

```txt
js/data.js
```

Där kan du ändra HP, attack och XP.

## Ändra story

Öppna:

```txt
js/scenes.js
```

## Viktig regel

Combat-val ska se ut så här:

```js
{
  text: "Möt bossen.",
  effect: () => startCombat(enemies.bossName, "scene_after_win")
}
```

Inte så här:

```js
{
  text: "Möt bossen.",
  next: "boss_fight",
  effect: () => startCombat(...)
}
```


## Nytt i Progression + Theme-versionen

- Klassunika attacker i combat.
- Abilities låses upp efter level.
- Cooldowns på starkare attacker.
- Starkaste attacker finns inte direkt.
- Dynamiskt tema:
  - Assassin: svart, crimson och lila
  - Mage: mörkblå, petrol och glimmer
  - Shaolin: orange, gul och ljusgrå känsla
- Abilities visas som låsta/upplåsta i sidopanelen.
- Companion combo finns kvar men kostar mana.

## Ability progression

### Assassin
- Level 1: Quick Slash
- Level 2: Shadow Step
- Level 4: Poison Blade
- Level 7: Susano

### Mage
- Level 1: Mana Bolt
- Level 2: Elemental Burst
- Level 4: Arcane Shield
- Level 7: Astral Rift

### Shaolin
- Level 1: Palm Strike
- Level 2: Chi Burst
- Level 4: Dragon Fist
- Level 7: Enlightened Form


## Nytt: Difficulty Menu

Spelet startar nu med en meny:

- Easy
- Normal
- Hard
- Nightmare

Svårighetsgraden påverkar:

- Fienders HP
- Fienders DC
- Fienders attack
- Fienders skada
- XP-belöning

Inställningarna finns i:

```txt
js/systems.js
```

Sök efter:

```js
DIFFICULTY_SETTINGS
```
