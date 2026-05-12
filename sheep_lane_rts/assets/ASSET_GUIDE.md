# Asset Guide

Lägg dina egna bilder här.

## Bakgrund

Fil:
`assets/battlefield.png`

Rekommenderad storlek:
`6400 x 720`

Du kan använda JPG/PNG/WebP, men om du ändrar filändelse måste du ändra i:
`src/assets.js`

```js
background: "battlefield.png"
```

## UI-ramar

Lägg i:
`assets/ui/`

Stödda filer:

- `button_frame.png`
- `button_frame_active.png`
- `button_frame_locked.png`
- `choice_frame.png`
- `card_frame.png`
- `panel_frame.png`

Tips:
Gör dem transparenta PNG/WebP så spelets text syns ovanpå.

## Ikoner

Lägg i:
`assets/icons/`

Exempel:

- `faction_standard.png`
- `faction_assassin.png`
- `faction_arcane_mage.png`
- `faction_shaolin.png`
- `standardsword1.png`
- `woolkong3.png`

Alla ikonfilnamn finns i `src/assets.js` under `UI_ASSETS`.

Rekommenderad storlek:
`256 x 256`

## Effekter

Lägg i:
`assets/effects/`

Stödda filer:

- `slash.png`
- `hit.png`
- `heal_particles.png`
- `cyclone.png`
- `susano_slash.png`
- `lightning.png`
- `level_up.png`
- `orb_projectile.png`
- `arrow_projectile.png`
- `kunai_projectile.png`
- `bolt_projectile.png`

Effekter bör ha transparent bakgrund.

## Om en bild saknas

Spelet kraschar inte.
Det använder placeholder/fallback istället.
