/* global fetch */
import config from '../../config/index.json';

const BASE_URL = `${config.apiBase}/${config.apiKey}/`;

export const MAP_KEY = Symbol('MAP_KEY');

const products = {
  [MAP_KEY]: new Map(),

  getProduct(id) {
    return products[MAP_KEY].get(id);
  },

  getProducts() {
    return Array.from(products[MAP_KEY].values());
  },
};

export default products;

export const fetchProducts = (pageNumber, pageCount) => fetch(
  `${BASE_URL}/${pageNumber}/${pageCount}`
)
  .then((response) => {
    if (!response.ok) {
      throw new Error(
        `Products fetch error ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  });

