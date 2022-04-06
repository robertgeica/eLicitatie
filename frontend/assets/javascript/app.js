import { login, logout, register, getUser } from "./api/auth.js";
import { redirectToPage } from "./utils.js";
import { addProduct, getProducts, getUserProducts } from "./api/product.js";
import { getCategories } from './api/category.js';
import { store, setStore } from "./store/store.js";

// show/hide navbar links
if (localStorage["auth-token"]) {
  document.getElementById("not-auth").classList.add("hide");
} else {
  document.getElementById("auth").classList.add("hide");
}

// update store if userId & auth-token
if (localStorage["userId"] && localStorage["auth-token"]) {
  let user = await getUser(localStorage["userId"]).then((response) => response);
  const { id, email, firstName, lastName, role, offersIds, productsIds } = user;
  let categories = await getCategories().then((response) => response);
  let products = await getProducts().then((response) => response);

  setStore({
    ...store(),
    user: { id, email, firstName, lastName, role, offersIds, productsIds },
    // categories: [...categories],
    products: [...products],
  });
}

// pages
const isLoginPage = window.location.pathname === "/frontend/pages/login.html";
const isRegisterPage = window.location.pathname === "/frontend/pages/register.html";

// prevent access to login/register page if user is already logged-in
if (localStorage["auth-token"] && (isLoginPage || isRegisterPage)) {
  redirectToPage("http://127.0.0.1:5500/client/index.html");
}


// get DOM elements for login/register form
const userEmail = document.getElementById("user-email");
const userPassword = document.getElementById("user-password");
const userFirstname = document.getElementById("user-firstname");
const userLastname = document.getElementById("user-lastname");
const logoutButton = document.getElementById("logout-button");

if (isLoginPage) {
  const loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log(userEmail, userPassword.value);
    await login(userEmail.value, userPassword.value);
  });
}

if (isRegisterPage) {
  const registerButton = document.getElementById("register-button");
  registerButton.addEventListener("click", async (e) => {
    e.preventDefault();

    await register(
      userEmail.value,
      userFirstname.value,
      userLastname.value,
      userPassword.value
    );
  });
}


logoutButton.addEventListener("click", (e) => {
  e.preventDefault();
  logout();
});