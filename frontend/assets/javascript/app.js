import { login, logout, register, getUser } from "./api/auth.js";
import { redirectToPage } from "./utils.js";
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
    categories: [...categories],
    products: [...products],
  });
}
