const QR_UNLOCKS = {
  GOTLAND_COWBOY_2026: "hat_cowboy",
  GOTLAND_DOFFY_2026: "glasses_doffy",
  GOTLAND_STRAWHAT_2026: "hat_strawhat",
  GOTLAND_HAWAII_2026: "glasses_hawaii",
  GOTLAND_SNORKEL_2026: "glasses_snorkel",
  GOTLAND_MAGENTA_2026: "body_magenta",
  GOTLAND_SENAP_2026: "body_senap",
};

let qrScanner = null;
let scannerRunning = false;

function getUnlockedAvatarItems() {
  return JSON.parse(localStorage.getItem("unlockedAvatarItems") || "[]");
}

function unlockAvatarItem(id) {
  const unlocked = getUnlockedAvatarItems();

  if (!unlocked.includes(id)) {
    unlocked.push(id);
    localStorage.setItem("unlockedAvatarItems", JSON.stringify(unlocked));
  }

  return id;
}

function refreshAvatarLocks() {
  const unlocked = getUnlockedAvatarItems();

  document.querySelectorAll(".avatar-item").forEach((button) => {
    const id = button.dataset.unlockId;

    if (unlocked.includes(id)) {
      button.classList.remove("locked");
      button.classList.add("unlocked");
    }
  });
}

function showQrMessage(message) {
  const qrMessage = document.getElementById("qr-message");
  if (qrMessage) qrMessage.textContent = message;
}

function handleQrCode(decodedText) {
  const rawCode = String(decodedText || "").trim();
  const cosmeticId = QR_UNLOCKS[rawCode];

  if (!cosmeticId) {
    showQrMessage("❌ Ogiltig QR-kod.");
    return;
  }

  unlockAvatarItem(cosmeticId);
  refreshAvatarLocks();

  const itemButton = document.querySelector(
    `.avatar-item[data-unlock-id="${cosmeticId}"]`
  );

  const itemName = itemButton?.textContent?.trim() || cosmeticId;

  showQrMessage(`✅ Upplåst: ${itemName}`);
}

window.addEventListener("DOMContentLoaded", () => {
  refreshAvatarLocks();

  const openButton = document.getElementById("openQrButton");
  const closeButton = document.getElementById("closeQrButton");
  const panel = document.getElementById("qrPopupPanel");

  openButton?.addEventListener("click", async () => {
    panel?.classList.add("open");
    showQrMessage("Rikta kameran mot QR-koden.");

    if (!window.Html5Qrcode) {
      showQrMessage("QR-läsaren kunde inte laddas.");
      return;
    }

    if (!qrScanner) {
      qrScanner = new Html5Qrcode("qr-reader");
    }

    if (scannerRunning) return;

    try {
      await qrScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 240,
        },
        (decodedText) => {
          handleQrCode(decodedText);
        }
      );

      scannerRunning = true;
    } catch (error) {
      showQrMessage("Kunde inte starta kameran.");
      console.error(error);
    }
  });

  closeButton?.addEventListener("click", async () => {
    panel?.classList.remove("open");

    if (qrScanner && scannerRunning) {
      await qrScanner.stop();
      scannerRunning = false;
    }
  });
});