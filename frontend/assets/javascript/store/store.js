const useState = (defaultValue) => {
  let initialValue = defaultValue;

  const getValue = () => initialValue;
  const setValue = (newValue) => (initialValue = newValue);

  return [getValue, setValue];
};

const [store, setStore] = useState({
  user: {
    email: "",
    firstName: "",
    lastName: "",
    role: null,
    offersIds: [],
    productsIds: [],
  },
  products: [],
  userProducts: [],
  product: {},
  categories: [],
  category: {},
});

export { store, setStore };
