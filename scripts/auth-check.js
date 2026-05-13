
import {
  loadProgressFromSupabase,
  enableAutoProgressSave
} from "./progress-sync.js";

const userId = localStorage.getItem("userId");

if (!userId) {
  window.location.href = "login.html";
} else {

  await loadProgressFromSupabase();

  enableAutoProgressSave();
}