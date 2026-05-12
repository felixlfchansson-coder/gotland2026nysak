const unlockedAvatarItems = JSON.parse(
  localStorage.getItem("unlockedAvatarItems") || "[]"
);

const unlockedCosmetics = JSON.parse(
  localStorage.getItem("unlockedCosmetics") || "[]"
);

const COSMETIC_TO_AVATAR = {
  black_sheep: "body_black",
  crimson_sheep: "body_crimson",
  petrol_sheep: "body_petrol",
  viridian_sheep: "body_viridian",

  harry_potter: "glasses_harry_potter",
  lee_sin: "glasses_lee_sin",
  sorting_hat: "hat_sortinghat",
};

const START_UNLOCKS = [
  "body_white",
  "glasses_sunglasses",
  "hat_tophat",
];

function isUnlocked(unlockId) {
  if (START_UNLOCKS.includes(unlockId)) return true;
  if (unlockedAvatarItems.includes(unlockId)) return true;

  return unlockedCosmetics.some(
    cosmeticId => COSMETIC_TO_AVATAR[cosmeticId] === unlockId
  );
}

function equipItem(item) {
  const type = item.dataset.type;
  const src = item.dataset.src;

  if (type === "body") {
    document.getElementById("avatarBody").src = src;
  }

  if (type === "glasses") {
    document.getElementById("avatarGlasses").src = src;
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
  }

  localStorage.setItem(`equipped_${type}`, src);
}

document.querySelectorAll(".avatar-item").forEach((item) => {
  const unlockId = item.dataset.unlockId;

  if (isUnlocked(unlockId)) {
    item.classList.remove("locked");
    item.classList.add("unlocked");

    item.addEventListener("click", () => {
      equipItem(item);
    });
  } else {
    item.classList.remove("unlocked");
    item.classList.add("locked");
  }
});

const equippedBody = localStorage.getItem("equipped_body");
if (equippedBody) {
  document.getElementById("avatarBody").src = equippedBody;
}

const equippedGlasses = localStorage.getItem("equipped_glasses");
if (equippedGlasses) {
  document.getElementById("avatarGlasses").src = equippedGlasses;
}

const equippedHat = localStorage.getItem("equipped_hat");
if (equippedHat) {
  let hatLayer = document.getElementById("avatarHat");

  if (!hatLayer) {
    hatLayer = document.createElement("img");
    hatLayer.id = "avatarHat";
    hatLayer.className = "avatar-layer";
    document.querySelector(".avatar-preview").appendChild(hatLayer);
  }

  hatLayer.src = equippedHat;
}