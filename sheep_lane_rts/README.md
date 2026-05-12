# Sheep Faction War MVP

Ett körbart HTML5 Canvas-MVP för ditt 2D lane-based RTS / faction war game.

## Kör lokalt

1. Packa upp ZIP-filen.
2. Öppna `index.html` direkt i webbläsaren.

Om din webbläsare blockerar ES modules lokalt, kör en liten lokal server:

```bash
python -m http.server 8000
```

Öppna sedan:

```text
http://localhost:8000
```

## Lägg in dina bilder

Skapa mappen:

```text
assets/
```

Lägg dina sprites där. Filnamnen ställs in i:

```text
src/assets.js
```

Om en bild saknas använder spelet placeholder-grafik automatiskt.

## Kontroller

- Välj faction längst ner.
- Klicka units för att spawna.
- `DEFEND`: units håller gate/frontline.
- `ATTACK`: units pushar mot fienden.
- Målet är att förstöra enemy base.

## Implementerat

- Passivt guld
- Unit cap
- Factions
- Melee/ranged/tank/support/boss
- Attack/defend order
- Mid tower
- Wolfsheep neutral guards
- Waves
- Enemy auto-spawn
- Structures: bases, gates, mid tower
- HP bars
- Camera follow
- Separata effects/projektiler


## Level-system

Spelaren börjar på level 1.

Standardfår låses upp så här:

- Level 1: första standardfåret
- Level 2: andra standardfåret
- Level 3: tredje standardfåret
- Level 5: fjärde standardfåret

På level 7 händer ett story/gameplay-skifte:

> Standardfår räcker inte längre.

Då får spelaren välja exakt en extra falang från tre val:

- Shadow
- Arcane
- Shaolin

Efter valet har spelaren bara:

- Standard
- den valda extra falangen

Extra falangens units låses i denna MVP upp på:

- Level 7
- Level 8
- Level 9
- Level 11

Du kan ändra detta i `src/game.js` i funktionen `getUnitUnlockLevel`.


## Uppdatering: Mid base, AI-levels och startmeny

### Startmeny

Spelet börjar nu i en startmeny där spelaren väljer AI-svårighetsgrad:

- Easy
- Normal
- Hard

Svårighetsgrad påverkar AI:ns spawn-tempo, XP-tempo och guldtempo.

### Mittenbas

Mitten är nu en neutral mid base/tower som erövras av först till kvarn.

Regler i MVP:

- Mid börjar neutral.
- Wolfsheep försvarar mitten så länge den är neutral.
- För att börja capture måste ett lag ha minst 3 units nära mitten.
- Alla neutral wolfsheep i området måste vara döda.
- Om ett lag håller kontroll några sekunder blir mid base deras.
- När mid base är tagen försvinner neutral wolfsheep-systemet.

Du kan ändra reglerna i `src/config.js`:

```js
midCaptureRadius
midCaptureSeconds
```

Och i `src/game.js` i funktionen:

```js
updateMidCapture()
```

### AI-levelsystem

AI följer nu samma levelsystem som spelaren:

- Standard-units låses upp på level 1, 2, 3 och 5.
- Extra faction-units låses upp på level 7, 8, 9 och 11.
- På AI level 7 väljer AI automatiskt antingen Ironhoof eller Stormflock.

### Factionval

Spelarens level 7-val är nu:

- Arcane Mage
- Assassin
- Shaolin

AI får bara:

- Ironhoof
- Stormflock


## Uppdatering: egna bilder, ikoner, effekter och UI-ramar

Spelet har nu ett tydligare asset-system.

Du kan lägga in:

- egen battlefield-bakgrund
- egna faction-ikoner
- egna unit-ikoner
- egna effektbilder
- egna ramar runt knappar och val

Se full guide här:

```text
assets/ASSET_GUIDE.md
```

De viktigaste mapparna:

```text
assets/
assets/icons/
assets/effects/
assets/ui/
```

Alla filnamn styrs i:

```text
src/assets.js
```

Om en bild saknas använder spelet fallback, så du kan lägga in bilder stegvis.


## Bugfix: Attack/Defend touch/click

Den här versionen använder en hårdare UI-fix:

- Attack/Defend använder click + pointerup + touchend.
- Startmenyn får klassen `is-closed` efter start och kan inte blockera spelet.
- Faction choice-overlay får också `is-closed` när den inte används.
- Attack/Defend-knapparna har högre z-index än resten av UI:t.
- Vald knapp får tydlig gul outline.


## Balance update: gate archers och starkare mid

### Gate archers

Varje gate har nu två stationära archers:

- 2 vid spelarens gate
- 2 vid AI:ns gate

De skjuter automatiskt på fiender inom range och försvinner praktiskt när gaten är död.

Balansvärden finns i `src/config.js`:

```js
gateArcherRange
gateArcherDamage
gateArcherAttackSeconds
```

### Starkare mitten

Mid är nu svårare att ta:

- fler wolfsheep från start
- wolfsheep har mer HP
- wolfsheep gör mer damage
- wolfsheep har mer armor
- capture kräver minst 5 units
- capture kräver tydligare övertag
- capture tar 7 sekunder

Balansvärden finns i `src/config.js`:

```js
midCaptureRadius
midCaptureSeconds
midCaptureMinUnits
```


## Placeholder-safe mode

Den här versionen har bildladdning avstängd som standard:

```js
useExternalAssets: false
```

Det betyder:

- inga 404-fel för saknade bilder
- spelet kör med placeholders
- du kan testa gameplay direkt

När du har lagt in riktiga bilder i `assets/`, ändra i:

```text
src/config.js
```

från:

```js
useExternalAssets: false
```

till:

```js
useExternalAssets: true
```


## Ny förbättrad version

Den här versionen innehåller:
- Magiska projectile-effekter
- Cinematic lighting overlay
- Förbättrade UI-ramar
- Starkare fantasy-känsla
- Förbättrad spelpresentation

Alla nya assets finns i:
- assets/effects/
- assets/ui/
