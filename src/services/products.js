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

export const getProduct = (id) => {
  const product = productsService[PRODUCTS].get(id);

  if (!product) {
    return product;
  }

  // TODO: Account for bad id/key index lookups?
  const keys = Array.from(productsService[PRODUCTS].keys());
  const idKeyIndex = keys.indexOf(id);

  return Object.assign(
    {
      nextProductId: keys[idKeyIndex + 1],
      previousProductId: keys[idKeyIndex - 1],
    },
    product
  );
};

export const getProducts = () => Array.from(productsService[PRODUCTS].values());

export const hasLoadedAllProducts = () => !!(
  productsService[LAST_RESPONSE_META] &&
  productsService[PRODUCTS].size &&
  productsService[LAST_RESPONSE_META].totalProducts <=
    productsService[PRODUCTS].size
);

/**
 * Load the next page of products.
 *
 * @returns {Promise<Array,Error>}
 */
export const loadProducts = () => {
  if (productsService[CURRENT_REQUEST]) {
    return productsService[CURRENT_REQUEST];
  } else if (hasLoadedAllProducts()) {
    return Promise.resolve([]);
  }

  productsService[CURRENT_REQUEST] = fetchProducts(
    productsService[LAST_REQUEST_PAGE] + 1,
    30
  )
    .then(({ pageNumber, products, totalProducts }) => {
      productsService[LAST_RESPONSE_META] = { pageNumber, totalProducts };
      productsService[CURRENT_REQUEST] = null;
      productsService[LAST_REQUEST_PAGE] += 1;

      products.forEach((product) => {
        productsService[PRODUCTS].set(product.productId, product);
      });

      return products;
    });

  return productsService[CURRENT_REQUEST];
};

