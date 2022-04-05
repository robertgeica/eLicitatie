import { redirectToPage } from "../utils.js";

const register = async (email, firstName, lastName, password) => {
  const data = {
    email,
    firstName,
    lastName,
    password,
    offersIds: [],
    productsIds: [],
  };

  fetch("http://localhost:5146/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => redirectToPage("http://127.0.0.1:5500/client/login.html"))
    .catch((err) => console.log(err));
};

const login = async (email, password) => {
  const data = {
    email: email,
    password: password,
  };

  fetch("http://localhost:5146/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.text())
    .then((data) => {
      const res = JSON.parse(data);
      localStorage.setItem("auth-token", res.token);
      localStorage.setItem("userId", res.userr.id);
      redirectToPage("http://127.0.0.1:5500/client/index.html");
    })
    .catch((err) => {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("userId");
    });
};

const getUser = async (id) => {
  return fetch(`http://localhost:5146/api/user/${id}`, {
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
    .catch((err) => {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("userId");
      redirectToPage("http://127.0.0.1:5500/client/login.html");
    });
};

const logout = () => {
  localStorage.removeItem("auth-token");
  localStorage.removeItem("userId");
  redirectToPage("http://127.0.0.1:5500/client/login.html");
};

const updateUser = (id, newUser) => {
  fetch(`http://localhost:5146/api/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${localStorage["auth-token"]}`,
    },
    body: JSON.stringify(newUser),
  })
    .then((response) => response.text())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => console.log(err));
};

export { login, register, logout, getUser, updateUser };
