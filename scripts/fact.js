const menuButton = document.getElementById("menuToggle");
const dropdownMenu = document.getElementById("dropdownMenu");

menuButton.addEventListener("click", () => {
  dropdownMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {

  const clickedInside =
    menuButton.contains(event.target) ||
    dropdownMenu.contains(event.target);

  if (!clickedInside) {
    dropdownMenu.classList.remove("open");
  }

});