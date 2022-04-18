import { getProduct } from "./api/product.js";
import { store } from "./store/store.js";
import { getDifferenceBetweenDates, renderLastOffer } from "./utils.js";

const isAuctionPage =
  window.location.pathname === "/frontend/pages/product.html";

const checkEndAuction = (daysLeft) => {
  if (daysLeft === 0) {
    return true;
  }

  return false;
};

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
      <p>${new Date(parseInt(offer.date)).toLocaleString("ro-RO")}</p>
    </div>`
    );
  return offersHTML.join("");
};

const renderAuction = (product) => {
  const daysLeft = getDifferenceBetweenDates(
    product.startDate,
    product.endDate
  );

  const auctionHasEnded = checkEndAuction(daysLeft);

  return `
  
    <div class="auction-info">
      <div>
        <img src="https://picsum.photos/300/200" alt="Italian Trulli"> 
        <p>${product.name}</p>
        <p>Auction id: ${product.id}</p> 
        <p>Category: ${renderProductCategory(product.categories)}</p>
        <p>Days left: ${auctionHasEnded ? "Auction has ended!" : daysLeft}</p>
        <p>Start price: ${product.startPrice}</p>
      </div>

      <div class="info-input"> 
        <p>Last offer: ${renderLastOffer(
          product.offers,
          product.startPrice
        )}</p>
        <input type="text" class="input" id="bid" name="bid">
        <button class="button" id="bid-btn" ${
          auctionHasEnded && "disabled"
        }>Bid!</button>
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
