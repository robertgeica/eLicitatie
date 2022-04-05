import { login, logout, register, getUser } from "./api/auth.js";
import { redirectToPage } from "./utils.js";
import { store, setStore } from "./store/store.js";

// show/hide navbar links
if (localStorage["auth-token"]) {
  document.getElementById("not-auth").classList.add("hide");
} else {
  document.getElementById("auth").classList.add("hide");
}
