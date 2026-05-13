const QR_UNLOCKS = {
  GOTLAND_COWBOY_2026: "hat_cowboy",
  GOTLAND_DOFFY_2026: "glasses_doffy",
  GOTLAND_STRAWHAT_2026: "hat_strawhat",
  GOTLAND_HAWAII_2026: "glasses_hawaii",
  GOTLAND_SNORKEL_2026: "glasses_snorkel",
  GOTLAND_MAGENTA_2026: "body_magenta",
  GOTLAND_SENAP_2026: "body_senap",

  // Senare superreward
  DRAGON_DEN_2026: "superreward_dragon_sheep",
};

let html5QrCode = null;
let scannerRunning = false;

function getUnlockedAvatarItems() {
  return JSON.parse(
    localStorage.getItem("unlockedAvatarItems") || "[]"
  );
}

function unlockAvatarItem(id) {
  const unlocked = getUnlockedAvatarItems();

  if (!unlocked.includes(id)) {
    unlocked.push(id);
    localStorage.setItem(
      "unlockedAvatarItems",
      JSON.stringify(unlocked)
    );
  }
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
  const msg = document.getElementById("qr-message");
  if (msg) msg.textContent = message;
}

async function stopScanner() {
  if (html5QrCode && scannerRunning) {
    try {
      await html5QrCode.stop();
      await html5QrCode.clear();
    } catch (err) {
      console.warn("QR stop error:", err);
    }

    scannerRunning = false;
  }
}

function handleQrCode(decodedText) {
  const code = String(decodedText || "").trim();
  const itemId = QR_UNLOCKS[code];

  if (!itemId) {
    showQrMessage("❌ Ogiltig QR-kod.");
    return;
  }

  unlockAvatarItem(itemId);
  refreshAvatarLocks();

  showQrMessage(`✅ Upplåst: ${itemId}`);

  stopScanner();
}

window.addEventListener("DOMContentLoaded", () => {
  const openButton = document.getElementById("openQrButton");
  const closeButton = document.getElementById("closeQrButton");
  const panel = document.getElementById("qrPopupPanel");

  if (!openButton || !closeButton || !panel) {
    console.warn("QR elements saknas på sidan.");
    return;
  }

  refreshAvatarLocks();

  openButton.addEventListener("click", async () => {
    panel.classList.add("open");
    panel.style.display = "block";

    showQrMessage("Startar kamera...");

    if (!window.Html5Qrcode) {
      showQrMessage("❌ QR-biblioteket laddades inte.");
      return;
    }

    try {
      html5QrCode = new Html5Qrcode("qr-reader");

      const cameras = await Html5Qrcode.getCameras();

      if (!cameras || cameras.length === 0) {
        showQrMessage("❌ Ingen kamera hittades.");
        return;
      }

      const cameraId =
        cameras.find(cam =>
          cam.label.toLowerCase().includes("back")
        )?.id || cameras[0].id;

      await html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: {
            width: 240,
            height: 240
          }
        },
        handleQrCode
      );

      scannerRunning = true;
      showQrMessage("Rikta kameran mot QR-koden.");

    } catch (err) {
      console.error("QR camera error:", err);
      showQrMessage("❌ Kunde inte öppna kameran. Tillåt kamera i webbläsaren.");
    }
  });

  closeButton.addEventListener("click", async () => {
    panel.classList.remove("open");
    panel.style.display = "none";

    await stopScanner();
  });
});