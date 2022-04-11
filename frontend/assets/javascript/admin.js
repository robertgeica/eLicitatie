import { login, logout, register, getUser } from "./api/auth.js";
import { addProduct, getProducts, getUserProducts } from "./api/product.js";
import { getCategories, addCategory, deleteCategory } from "./api/category.js";
import { store, setStore } from "./store/store.js";

// update store if userId & auth-token
if (localStorage["userId"] && localStorage["auth-token"]) {
  let user = await getUser(localStorage["userId"]).then((response) => response);
  const { id, email, firstName, lastName, role, offersIds, productsIds } = user;
  let categories = await getCategories().then((response) => response);
  let products = await getProducts().then((response) => response);
  // let userProducts = await getUserProducts(user).then((response) => response);

  setStore({
    ...store(),
    user: { id, email, firstName, lastName, role, offersIds, productsIds },
    categories: [...categories],
    products: [...products],
    // userProducts: [...userProducts],
  });
}

const isAdminPage = window.location.pathname === "/frontend/pages/admin.html";

const addCategoryForm = () => {
  let subcategoriesArr = [];

  const subcategoriesContainer = document.getElementById("subcategories-list");
  const addSubcategoryBtn = document.getElementById("add-subcategory-btn");
  addSubcategoryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const subcategoryName = document.getElementById("subcategory-input");
    subcategoriesArr.push(subcategoryName.value);

    const subcategoryHtml = `<p id="subcategory-item">${subcategoryName.value}</p>`;
    subcategoryName.value = "";
    subcategoriesContainer.innerHTML =
      subcategoryHtml + subcategoriesContainer.innerHTML;
  });

  const categoryNameDOM = document.getElementById("category-name");
  const addCategoryBtn = document.getElementById("add-category-btn");

  addCategoryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addCategory(categoryNameDOM.value, subcategoriesArr);
    categoryNameDOM.value = "";
    subcategoriesArr = [];
    subcategoriesContainer.innerHTML = "";
  });
};

const renderCategories = () => {
  const categoryContainer = document.getElementById("category-container");
  store().categories.forEach((category) => {
    const subcategories = category.subcategories.map(
      (subcategory) => `<p class="subcategory">${subcategory}</p>`
    );
    const categoryHtml = `
      <div class="category-box">
        <h4 class="category-name">${category.name}</h4> 
        
        <div class="subcategories-box">
        ${subcategories.join("\n")}
        </div>
        <span class="delete-category-btn" data-id="${
          category.id
        }">Delete</span>
      </div>
    `;
    categoryContainer.innerHTML = categoryHtml + categoryContainer.innerHTML;
  });
};

const addDeleteCategory = () => {
  document.querySelectorAll(".delete-category-btn").forEach((category) =>
    category.addEventListener("click", (e) => {
      e.preventDefault();
      const categoryId = e.target.getAttribute("data-id");
      deleteCategory(categoryId);
    })
  );
};

if (isAdminPage) {
  document.getElementById("welcome-admin").innerHTML = `Salut, ${
    store().user.firstName
  }!`;
  addCategoryForm();
  renderCategories();
  addDeleteCategory();
}
