import { login, logout, register, getUser } from "./api/auth.js";
import { redirectToPage } from "./utils.js";
import { getProduct, getProducts, getUserProducts } from "./api/product.js";
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
  return `
  <div class="auction-container">
    <img src="https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg" width="400" height="200" alt="photo" data-id="${
      auction.id
    }" />
    <div class="text-content">
    <h2 data-id="${auction.id}">${auction.name}</h2>
    <h4>${category}</h4>
    <div style="display: flex">
      <span style="margin-right: 10px">Last bid</span>
      <h4>${0}</h4>
    </div>
    <p>${auction.endDate}</p>
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

const convertDate = (date) => {
  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);

  return `${month}/${day}/${year}`;
};

const getDifferenceBetweenDates = (startDate, endDate) => {
  const convertStartDate = convertDate(startDate);
  const convertEndDate = convertDate(endDate);
  startDate = new Date(convertStartDate);
  endDate = new Date(convertEndDate);

  const difference = endDate.getTime() - startDate.getTime();
  const daysLeft = Math.ceil(difference / (1000 * 3600 * 24));
  return daysLeft;
};

const renderProductCategory = category => {
  return category.map(c => c)
}

const renderLastOffer = (offers, startPrice) => {
  return offers[offers.length -1] || startPrice;
}

const renderOffers = offers => {
  console.log(offers)
  return offers
}

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
      </div>

      <div class="info-input"> 
        <p>Last offer: ${renderLastOffer(product.offers, product.startPrice)}</p>
        <input type="text" class="input" id="bid" name="bid">
        <button class="button">bid</button>
      </div>
    </div>

    <div class="auction-description"> ${product.description} </div>

    <div class="auction-offers">
      <p>Start price: ${product.startPrice}</p>
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
}
