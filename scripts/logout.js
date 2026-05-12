function logoutUser() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("currentUser");
  sessionStorage.clear();

  window.location.href = "login.html";
}