async function logoutUser() {
  if (window.supabaseClient) {
    await window.supabaseClient.auth.signOut();
  }

  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");

  window.location.href = "login.html";
}