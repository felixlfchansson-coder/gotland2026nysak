document.addEventListener("DOMContentLoaded", () => {
  $("saveBtn").onclick = saveGame;
  $("loadBtn").onclick = loadGame;
  $("resetBtn").onclick = resetGame;

  showStartMenu();
  render();
});
