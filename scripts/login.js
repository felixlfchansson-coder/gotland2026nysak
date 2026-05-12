// =========================
// Supabase
// =========================

const supabaseUrl = "https://xeretvarnzfrplzljkvt.supabase.co";
const supabaseKey = "sb_publishable_aePOQWv07JVNYuqoUzeNlA_KIwvjMnX";

const db = window.supabase.createClient(supabaseUrl, supabaseKey);

// =========================
// Om redan inloggad
// =========================

const existingUser = localStorage.getItem("userId");

if (existingUser) {
  window.location.href = "index.html";
}

// =========================
// Element
// =========================

const loginForm = document.getElementById("loginForm");
const quoteText = document.querySelector(".norris-citat-text");

// =========================
// Citat
// =========================

const citat = [
  '"Ingen kommer in utan QR-kod."',
  '"Sheep Norris ser allt."',
  '"QR-koder fruktar Sheep Norris."',
  '"Endast de värdiga får passera."'
];

if (quoteText) {
  quoteText.textContent = citat[Math.floor(Math.random() * citat.length)];
}

// =========================
// Login
// =========================

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const qrInput = document.getElementById("id");

  const name = nameInput.value.trim();
  const qrToken = qrInput.value.trim();

  if (!name || !qrToken) {
    alert("Fyll i både namn och QR-kod.");
    return;
  }

  try {
    const { data, error } = await db
      .from("anvandare")
      .select("id, namn, roll, grupp, aktiv")
      .eq("namn", name)
      .eq("qr_token", qrToken)
      .eq("aktiv", true)
      .maybeSingle();

    if (error) {
      console.error("SUPABASE ERROR:", error);
      alert("Databasfel: " + error.message);
      return;
    }

    if (!data) {
      alert("Sheep Norris nekar dig tillträde.");
      return;
    }

    localStorage.setItem("userId", data.id);
    localStorage.setItem("userName", data.namn);
    localStorage.setItem("userRole", data.roll || "");
    localStorage.setItem("userGroup", data.grupp || "");

    window.location.href = "index.html";

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert("Något gick fel vid inloggning.");
  }
});