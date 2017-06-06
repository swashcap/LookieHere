import fetchProducts from './fetch-products';

export const CURRENT_REQUEST = Symbol('CURRENT_REQUEST');
export const LAST_REQUEST_PAGE = Symbol('LAST_REQUEST_PAGE');
export const LAST_RESPONSE_META = Symbol('LAST_RESPONSE_META');
export const PRODUCTS = Symbol('PRODUCTS');

const productsService = {
  [CURRENT_REQUEST]: null,
  [LAST_REQUEST_PAGE]: 0,
  [LAST_RESPONSE_META]: null,
  [PRODUCTS]: new Map(),
};

export default productsService;

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

export const getProduct = id => productsService[PRODUCTS].get(id);

export const getProducts = () => Array.from(productsService[PRODUCTS].values());

