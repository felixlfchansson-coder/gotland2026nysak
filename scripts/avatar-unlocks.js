// =========================
// Avatar unlocks
// Samma IDs som token-hs.html
// =========================

const unlockedItems = JSON.parse(
  localStorage.getItem("unlockedItems")
) || [
  "body_base",
  "body_white",
  "hat_tophat",
  "glasses_sunglasses"
];

document.querySelectorAll(".avatar-item").forEach((button) => {
  const unlockId = button.dataset.unlockId;

  if (!unlockId) return;

  if (unlockedItems.includes(unlockId)) {
    button.classList.remove("locked");
    button.classList.add("unlocked");
    button.disabled = false;
  } else {
    button.classList.remove("unlocked");
    button.classList.add("locked");
    button.disabled = true;
  }
});

document.querySelectorAll(".avatar-item").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("locked")) return;

    const type = button.dataset.type;
    const src = button.dataset.src;

    if (!type || !src) return;

    if (type === "body") {
      document.getElementById("avatarBody").src = src;
      localStorage.setItem("selectedBody", src);
    }

    if (type === "hat") {
      let hatLayer = document.getElementById("avatarHat");

      if (!hatLayer) {
        hatLayer = document.createElement("img");
        hatLayer.id = "avatarHat";
        hatLayer.className = "avatar-layer";
        document.querySelector(".avatar-preview").appendChild(hatLayer);
      }

      hatLayer.src = src;
      localStorage.setItem("selectedHat", src);
    }

    if (type === "glasses") {
      document.getElementById("avatarGlasses").src = src;
      localStorage.setItem("selectedGlasses", src);
    }

    if (type === "shirt") {
      let shirtLayer = document.getElementById("avatarShirt");

      if (!shirtLayer) {
        shirtLayer = document.createElement("img");
        shirtLayer.id = "avatarShirt";
        shirtLayer.className = "avatar-layer";
        document.querySelector(".avatar-preview").appendChild(shirtLayer);
      }

      shirtLayer.src = src;
      localStorage.setItem("selectedShirt", src);
    }
  });
});

// =========================
// Load selected avatar
// =========================

const selectedBody = localStorage.getItem("selectedBody");
const selectedGlasses = localStorage.getItem("selectedGlasses");
const selectedHat = localStorage.getItem("selectedHat");
const selectedShirt = localStorage.getItem("selectedShirt");

if (selectedBody && document.getElementById("avatarBody")) {
  document.getElementById("avatarBody").src = selectedBody;
}

if (selectedGlasses && document.getElementById("avatarGlasses")) {
  document.getElementById("avatarGlasses").src = selectedGlasses;
}

if (selectedHat) {
  const hatLayer = document.createElement("img");
  hatLayer.id = "avatarHat";
  hatLayer.className = "avatar-layer";
  hatLayer.src = selectedHat;
  document.querySelector(".avatar-preview").appendChild(hatLayer);
}

if (selectedShirt) {
  const shirtLayer = document.createElement("img");
  shirtLayer.id = "avatarShirt";
  shirtLayer.className = "avatar-layer";
  shirtLayer.src = selectedShirt;
  document.querySelector(".avatar-preview").appendChild(shirtLayer);
}