import axios from 'axios';
const API_URL = 'http://localhost:3004'

// ----------------------------Service-Account----------------------------
export const registerAccount = (email, password, name, phoneNumber, address) => axios
    .post(`${API_URL}/accounts`, { email, password, name, phoneNumber, address });

export const registerBuyer = (email, password, name, phoneNumber, address) => {
  return axios.post(`${API_URL}/accounts/`, {
    email, password, name, phoneNumber, address
  });
};

export const registerSeller = (email, password, name, phoneNumber, address) => {
  return axios.post(`${API_URL}/accounts/createseller`, {
    email, password, name, phoneNumber, address
  });
};

export const loginAccount = (email, password) => axios.post(`${API_URL}/accounts/login`,
     { email, password });

export const uploadAccountImage = async (accountId, imageFile) => {
  const formData = new FormData();
  formData.append('profileImage', imageFile);

  return await axios.post(`${API_URL}/accounts/${accountId}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};


export const getAccount = (accountId) => axios.get(`${API_URL}/accounts/${accountId}`);

export const updateProfile = (idProfile, data) => axios.put(`${API_URL}/accounts/profile/${idProfile}`, data);

//export const updateProfile = (idProfile, data) => axios.put(`${API_URL}/accounts/profileB/${idProfile}`, data);


// ----------------------------Service-Order----------------------------
export const getOrdersByIds = (ids) => axios.post(`${API_URL}/orders/byIds`, { ids });

export const ordersByProfile = (idProfile) => axios.get(`${API_URL}/orders/${idProfile}`);

export const createOrder = (idProfile, productList, totalPrice, idStore) => axios.post(`${API_URL}/orders`, { idProfile, productList, totalPrice, idStore }); //se entrega product list de id de productos -nelson

export const changeStateOrder = (id, state) => axios.put(`${API_URL}/orders/${id}`, state);

export const addProductOrder = (id, product) => axios.put(`${API_URL}/orders/${id}`, product);


// ----------------------------Service-Stores----------------------------
export const updateStore = (id, data) => axios.put(`${API_URL}/stores/${id}`, data);

export const addRatingToStore = (idStore, ratingId) => axios.post(`${API_URL}/stores/${idStore}/addrating`, { ratingId });

export const storeByCity = (city) => axios.get(`${API_URL}/stores/city/${city}`);

export const getStoreById = (id) => axios.get(`${API_URL}/stores/${id}`);

export const getLogoStore = (id) => axios.get(`${API_URL}/stores/${id}`);

export const getProductById = (id) => axios.get(`${API_URL}/stores/product/id/${id}`);

export const getProductsByStore = (idStore) => axios.get(`${API_URL}/stores/product/store/${idStore}`);

export const getImageProduct = (id) => axios.get(`${API_URL}/stores/product/${id}/image`);

// Agregar/Publicar Libros
export const createBook = (bookData) => {
  return axios.post(`${API_URL}/stores`, bookData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// ----------------------------Services-Ranking----------------------------
export const getRatingsByStore = (id) => axios.get(`${API_URL}/ratings/stores/${id}`);

export const createRating = (idStore, idOrder, idProfile, stars, comment) => axios
    .post(`${API_URL}/ratings`,{ idStore, idOrder, idProfile, stars, comment });