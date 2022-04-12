import { login, logout, register, getUser } from "./api/auth.js";
import {
  redirectToPage,
  convertDate,
  getDifferenceBetweenDates,
  renderLastOffer,
} from "./utils.js";
import {
  getProduct,
  getProducts,
  getUserProducts,
  addNewOffer,
} from "./api/product.js";
import { getCategories } from "./api/category.js";
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

// pages
const isLoginPage = window.location.pathname === "/frontend/pages/login.html";
const isRegisterPage =
  window.location.pathname === "/frontend/pages/register.html";

// prevent access to login/register page if user is already logged-in
if (localStorage["auth-token"] && (isLoginPage || isRegisterPage)) {
  redirectToPage("http://127.0.0.1:5500/frontend/index.html");
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

// if user role is admin, display admin page link
if (store().user.role === "admin") {
  const isHomepage = window.location.pathname === "/frontend/index.html";
  const adminLink = `<a class="link" href="${
    isHomepage ? "./pages/admin.html" : "../pages/admin.html"
  }">Admin</a>`;
  const authContainer = document.getElementById("auth");
  authContainer.innerHTML = adminLink + authContainer.innerHTML;
}

const isHomepage = window.location.pathname === "/frontend/index.html";
// renderCard
const renderCard = (auction) => {
  const category = auction.categories.map(
    (category) => ` <span>${category}</span>`
  );
  const lastOffer = renderLastOffer(auction.offers, auction.startPrice);

  return `
  <div class="auction-container">
    <img src="https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg" width="400" height="200" alt="photo" data-id="${
      auction.id
    }" />
    <div class="text-content">
    <h3 data-id="${auction.id}">${auction.name}</h3>
    <h5>${category}</h5>
    <p> Last offer:
      ${lastOffer}
    </p>
    <p>${getDifferenceBetweenDates(
      auction.startDate,
      auction.endDate
    )} days left</p>
    </div>
  </div>
  `;
};

const auctionCategoriesFilter = document.getElementById(
  "auctions-category-select"
);
const renderAuctions = (isFiltered, selectedCategory) => {
  const auctions =
    isFiltered && selectedCategory.length !== 0 ? isFiltered : store().products;
  auctionCategoriesFilter.innerHTML = "";

  store().categories.forEach((category, index) => {
    category.subcategories.forEach((subcategory) => {
      const optionSubcategory = `<option value="${subcategory}" ${
        subcategory === selectedCategory ? "selected" : ""
      }>---${subcategory}</option>`;
      auctionCategoriesFilter.innerHTML =
        optionSubcategory + auctionCategoriesFilter.innerHTML;
    });

    const optionCategory = `<option value="${category.name}" ${
      category.name === selectedCategory ? "selected" : ""
    }>${category.name}</option>`;
    auctionCategoriesFilter.innerHTML =
      optionCategory + auctionCategoriesFilter.innerHTML;
  });

  const cards = auctions.map((auction) => renderCard(auction));

  return cards.join("");
};

const filterAuctions = () => {
  auctionCategoriesFilter.onchange = (e) => {
    const auctions = store().products;
    const selectedCategory = e.target.value;
    let newAuctions = auctions.map((product) => {
      const hasCategory = product.categories.filter(
        (category) => category === auctionCategoriesFilter.value
      );

      if (hasCategory.length > 0) {
        return product;
      }
    });

    newAuctions = newAuctions.filter(
      (product) => typeof product !== "undefined"
    );

    document.getElementById("auctions").innerHTML = renderAuctions(
      newAuctions,
      selectedCategory.trim()
    );
  };
};

if (isHomepage) {
  const auctionsContainer = document.getElementById("auctions");
  auctionsContainer.innerHTML = renderAuctions();

  filterAuctions();
}

const auctionContainer = document.querySelectorAll(".auction-container");
for (const auction of auctionContainer) {
  auction.addEventListener("click", (e) => {
    localStorage.setItem("productId", e.target.dataset.id);
    redirectToPage(`http://127.0.0.1:5500/frontend/pages/product.html`);
  });
}

// auction page
const isAuctionPage =
  window.location.pathname === "/frontend/pages/product.html";

const renderProductCategory = (category) => {
  return category.map((c) => c);
};

const renderOffers = (offers) => {
  const offersHTML = offers
    .sort((a, b) => b.value - a.value)
    .map(
      (offer) => `<div class="offer">
      <div class="offer-info">
        <p>${offer.value}</p>
        <p>${offer.userName}</p>
      </div>
      <p>${new Date(parseInt(offer.date)).toLocaleString('ro-RO')}</p>
    </div>`
    );
  return offersHTML.join("");
};

const renderAuction = (product) => {
  const daysLeft = getDifferenceBetweenDates(
    product.startDate,
    product.endDate
  );

  return `
  
    <div class="auction-info">
      <div>
        <img src="https://picsum.photos/300/200" alt="Italian Trulli"> 
        <p>${product.name}</p>
        <p>Auction id: ${product.id}</p> 
        <p>Category: ${renderProductCategory(product.categories)}</p>
        <p>Days left: ${daysLeft}</p>
        <p>Start price: ${product.startPrice}</p>
      </div>

      <div class="info-input"> 
        <p>Last offer: ${renderLastOffer(
          product.offers,
          product.startPrice
        )}</p>
        <input type="text" class="input" id="bid" name="bid">
        <button class="button" id="bid-btn">Bid!</button>
      </div>
    </div>

    <div class="auction-description"> ${product.description} </div>

    <div class="auction-offers">
      <p>Offers</p>
      ${renderOffers(product.offers)}
  `;
};

if (isAuctionPage) {
  const productId = localStorage.getItem("productId");
  await getProduct(productId);

  document.getElementById("product-container").innerHTML = renderAuction(
    store().product
  );

  document
    .getElementById("bid-btn")
    .addEventListener("click", (e) =>
      addNewOffer(
        store().product,
        store().user,
        document.getElementById("bid").value
      )
    );
}
