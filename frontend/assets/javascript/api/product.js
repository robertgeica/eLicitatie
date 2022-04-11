import { updateUser, getUser } from "./auth.js";
import { store, setStore } from "../store/store.js";
const getProducts = async () => {
  return fetch("http://localhost:5275/api/product", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${localStorage["auth-token"]}`,
    },
  })
    .then((response) => response.text())
    .then((data) => {
      const res = JSON.parse(data);

      return res;
    })
    .catch((err) => console.log(err));
};

const getProduct = async (id) => {
  return fetch(`http://localhost:5275/api/product/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${localStorage["auth-token"]}`,
    },
  })
    .then((response) => response.text())
    .then((data) => {
      const res = JSON.parse(data);
      setStore({
        ...store(),
        product: res,
      });
      return res;
    })
    .catch((err) => console.log(err));
};

const addProduct = async (product) => {
  const {
    userId,
    name,
    startPrice,
    startDate,
    endDate,
    auctionType,
    description,
    imageUrl,
    categories,
  } = product;

  const data = {
    userId,
    name,
    startPrice,
    startDate,
    endDate,
    auctionType,
    description,
    imageUrl,
    categories,
    offers: [],
  };

  fetch("http://localhost:5275/api/product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${localStorage["auth-token"]}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      const newUser = {
        firstName: store().user.firstName,
        lastName: store().user.lastName,
        offersIds: store().user.offersIds,
        productsIds: [...store().user.productsIds, data.id],
      };
      updateUser(data.userId, newUser);
    })
    .catch((err) => console.log(err));
};

const getUserProducts = async (user) => {
  const urls = user.productsIds.map(
    (id) => `http://localhost:5275/api/product/${id}`
  );

  const headers = {
    "Content-Type": "application/json",
    Authorization: `bearer ${localStorage["auth-token"]}`,
  };

  try {
    let res = await Promise.all(urls.map((e) => fetch(e, { headers })));
    let resJson = await Promise.all(res.map((e) => e.json()));
    resJson = resJson.map((e) => e);
    setStore({
      ...store(),
      userProducts: [...resJson],
    });
    return resJson;
  } catch (err) {
    console.log(err);
  }
};

const updateProduct = async (id, product) => {
  fetch(`http://localhost:5275/api/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${localStorage["auth-token"]}`,
    },
    body: JSON.stringify(product),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
}

const addNewOffer = async (product, user, offerPrice) => {

  const hasOffers = product.offers.length > 0;
  const lastOffer = product.offers.sort((a, b) => b.value - a.value)[0].value;

  if (
    (hasOffers &&
      parseInt(offerPrice) <= lastOffer) ||
    product.startPrice > parseInt(offerPrice)
  )
    return console.log(
      "Bid must be higher than the last offer or start price."
    );

  const newOffer = {
    userId: user.id,
    value: offerPrice,
    offerId: product.offers.length
  };
  const newProduct = {
    ...product,
    offers: [...product.offers, newOffer],
  };

  const newUser = {
    ...user,
    offersIds: [
      ...user.offersIds,
      { productId: product.id, value: offerPrice },
    ],
  };

  await updateProduct(product.id, newProduct);
  await updateUser(user.id, newUser);
  
};
export { getProducts, getProduct, addProduct, getUserProducts, addNewOffer };
