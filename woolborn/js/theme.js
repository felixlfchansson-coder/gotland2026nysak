function applyTheme(){
  document.body.classList.remove("theme-assassin", "theme-mage", "theme-shaolin");

  if(game.player.classPath === "Assassin"){
    document.body.classList.add("theme-assassin");
  }

  if(game.player.classPath === "Mage"){
    document.body.classList.add("theme-mage");
  }

  if(game.player.classPath === "Shaolin"){
    document.body.classList.add("theme-shaolin");
  }
}