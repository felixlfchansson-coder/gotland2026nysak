const $ = id => document.getElementById(id);

function roll(sides = 20){
  return Math.floor(Math.random() * sides) + 1;
}

function clamp(value, min, max){
  return Math.max(min, Math.min(max, value));
}

function log(text){
  game.log.unshift(text);
  game.log = game.log.slice(0, 12);
}