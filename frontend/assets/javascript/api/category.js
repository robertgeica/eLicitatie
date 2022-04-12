import { refreshPage } from "../utils.js";


const getCategories = async () => {
  return fetch("http://localhost:5275/api/category", {
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

const addCategory = async (name, subcategories) => {
  const data = {
    name,
    subcategories,
  };

  fetch("http://localhost:5275/api/category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${localStorage["auth-token"]}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => refreshPage())
    .catch((err) => console.log(err));
};

const deleteCategory = async (id) => {
  return fetch(`http://localhost:5275/api/category/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${localStorage["auth-token"]}`,
    },
  })
    .then((response) => response.text())
    .then((data) => refreshPage())
    .catch((err) => console.log(err));
};

export { getCategories, addCategory, deleteCategory };
