  const sheepLines = [
    "Skynda! Måndagen börjar snart!",
    "Glöm inte andakten!",
    "Psst... kolla nästa aktivitet.",
    "Tiden går! Har du koll på schemat?",
    "Ett steg i taget genom dagen!"
  ];

  function sheepTalk() {
    const bubble = document.getElementById("sheepBubble");
    const randomLine = sheepLines[Math.floor(Math.random() * sheepLines.length)];

    bubble.textContent = randomLine;
    bubble.classList.add("show");

    setTimeout(() => {
      bubble.classList.remove("show");
    }, 3500);
  }
const menuButton = document.getElementById("menuToggle");
const dropdownMenu = document.getElementById("dropdownMenu");

if (menuButton && dropdownMenu) {

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

}

const dayButtons = document.querySelectorAll(".day-btn");
const dayCards = document.querySelectorAll(".day-card");

dayButtons.forEach(button => {

  button.addEventListener("click", () => {

    const targetDay = button.dataset.day;

    dayButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    dayCards.forEach(card => {
      card.classList.remove("active-day");
    });

    button.classList.add("active");

    document
      .getElementById(targetDay)
      .classList.add("active-day");

  });

});