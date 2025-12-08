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

export const loginAccount = (email, password) => axios.post(`${API_URL}/accounts/login`, { email, password });

export const uploadAccountImage = async (accountId, imageFile) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append('profileImage', imageFile);

  return await axios.post(`${API_URL}/accounts/${accountId}/upload-image`, formData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getAccount = (accountId) => axios.get(`${API_URL}/accounts/${accountId}`);

export const getProfile = (profileId) => axios.get(`${API_URL}/accounts/buyer/${profileId}`);

export const updateAccount = (idProfile, data) => axios.put(`${API_URL}/accounts/account/${idProfile}`, data);

export const updateProfile = (idProfile, data) => axios.put(`${API_URL}/accounts/buyer/${idProfile}`, data);

export const addOrderToSeller = (idSeller, idSubOrder) => axios.put(`${API_URL}/accounts/seller/${idSeller}/addorder`, { orderId: idSubOrder});

// ----------------------------Service-Order----------------------------
export const getSubOrderById = (idSubOrder) => axios.get(`${API_URL}/orders/suborder/${idSubOrder}`);

export const getOrderByIds = (idOrder) => axios.get(`${API_URL}/orders/${idOrder}`);

export const ordersByProfile = (idProfile) => axios.get(`${API_URL}/orders/buyer/${idProfile}`);

export const createOrder = (idBuyer, productList, totalPrice) => axios.post(`${API_URL}/orders`, idBuyer, productList, totalPrice);

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
  const token = localStorage.getItem("token");
  return axios.post(`${API_URL}/stores`, bookData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
};

export const updateStockToBook = (idBook, data) =>  axios.put(`${API_URL}/stores/book/${idBook}`, data);

// ----------------------------Services-Ranking----------------------------
export const getRatingsByStore = (id) => axios.get(`${API_URL}/ratings/stores/${id}`);

export const createRating = (idStore, idOrder, idProfile, stars, comment) => axios
    .post(`${API_URL}/ratings`,{ idStore, idOrder, idProfile, stars, comment });