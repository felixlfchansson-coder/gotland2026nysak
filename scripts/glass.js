const openGlassModal = document.getElementById("openGlassModal");
const glassModal = document.getElementById("glassModal");

const closeGlassModal = document.getElementById("closeGlassModal");
const modalCloseButton = document.getElementById("modalCloseButton");

const flavourList = document.getElementById("modalFlavourList");
const flavourCount = document.getElementById("modalFlavourCount");

let allFlavours = [];

function openModal() {
  glassModal.classList.add("show");
  glassModal.setAttribute("aria-hidden", "false");

  document.body.classList.add("modal-open");
}

function closeModal() {
  glassModal.classList.remove("show");
  glassModal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("modal-open");
}

openGlassModal.addEventListener("click", openModal);

closeGlassModal.addEventListener("click", closeModal);

modalCloseButton.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

async function loadFlavours() {

  const response = await fetch("smaker.json");

  const data = await response.json();

  allFlavours = data.glassSmaker;

  renderFlavours(allFlavours);
}

function renderFlavours(flavours) {

  flavourList.innerHTML = "";

  flavourCount.textContent = flavours.length;

  flavours.forEach(flavour => {

    const card = document.createElement("div");

    card.className = "flavour-card";

    card.innerHTML = `
      <span class="flavour-icon">🍨</span>
      <p>${flavour}</p>
    `;

    flavourList.appendChild(card);
  });
}

loadFlavours();