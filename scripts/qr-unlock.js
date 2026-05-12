const qrMessage = document.getElementById("qr-message");

const openQrButton = document.getElementById("openQrButton");
const closeQrButton = document.getElementById("closeQrButton");
const qrPopupPanel = document.getElementById("qrPopupPanel");

let qrScanner = null;
let scannerIsRunning = false;

async function unlockFromQr(code) {
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (!user) {
    qrMessage.textContent = "Du måste vara inloggad.";
    return;
  }

  const { data: qrItem, error: qrError } = await supabaseClient
    .from("avatar_qr_codes")
    .select("*")
    .eq("code", code)
    .eq("active", true)
    .single();

  if (qrError || !qrItem) {
    qrMessage.textContent = "Ogiltig QR-kod.";
    return;
  }

  const { error: unlockError } = await supabaseClient
    .from("avatar_unlocks")
    .upsert({
      user_id: user.id,
      item_type: qrItem.item_type,
      item_src: qrItem.item_src,
      unlocked: true
    });

  if (unlockError) {
    console.error(unlockError);
    qrMessage.textContent = "Kunde inte låsa upp item.";
    return;
  }

  qrMessage.textContent = "Upplåst! 🎉";

  setTimeout(() => {
    location.reload();
  }, 800);
}

function openQrPanel() {
  qrPopupPanel.classList.add("show");
  qrMessage.textContent = "Rikta kameran mot QR-koden.";

  if (!qrScanner) {
    qrScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 220
      },
      false
    );
  }

  if (!scannerIsRunning) {
    qrScanner.render((decodedText) => {
      scannerIsRunning = false;
      unlockFromQr(decodedText);
      qrScanner.clear();
    });

    scannerIsRunning = true;
  }
}

function closeQrPanel() {
  qrPopupPanel.classList.remove("show");

  if (qrScanner && scannerIsRunning) {
    qrScanner.clear();
    scannerIsRunning = false;
  }
}

openQrButton.addEventListener("click", () => {
  if (qrPopupPanel.classList.contains("show")) {
    closeQrPanel();
  } else {
    openQrPanel();
  }
});

closeQrButton.addEventListener("click", closeQrPanel);

document.addEventListener("click", (event) => {
  const clickedInside =
    qrPopupPanel.contains(event.target) ||
    openQrButton.contains(event.target);

  if (!clickedInside) {
    closeQrPanel();
  }
});