const supabaseUrl = "https://xeretvarnzfrplzljkvt.supabase.co";
const supabaseKey = "DIN_ANON_KEY_HÄR";

const db = window.supabase.createClient(supabaseUrl, supabaseKey);

const existingUser = localStorage.getItem("userId");

if (existingUser) {
  window.location.href = "index.html";
}

const loginForm = document.getElementById("loginForm");
const quoteText = document.querySelector(".norris-citat-text");

const citat = [
  '"Ingen kommer in utan QR-kod."',
  '"Sheep Norris ser allt."',
  '"QR-koder fruktar Sheep Norris."',
  '"Endast de värdiga får passera."'
];

if (quoteText) {
  quoteText.textContent =
    citat[Math.floor(Math.random() * citat.length)];
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const codeInput = document.getElementById("id");

  const name = nameInput.value.trim().toLowerCase();
  const code = codeInput.value.trim();

  if (!name || !code) {
    alert("Fyll i både namn och kod.");
    return;
  }

  const email = `${name}@sheep.local`;

  const { data, error } = await db.auth.signInWithPassword({
    email,
    password: code
  });

  if (error) {
    console.error("LOGIN ERROR:", error);
    alert("Sheep Norris nekar dig tillträde.");
    return;
  }

  localStorage.setItem("userId", data.user.id);
  localStorage.setItem("userName", name);
  localStorage.setItem("userEmail", email);

  window.location.href = "index.html";
});