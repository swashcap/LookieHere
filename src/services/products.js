import fetchProducts from './fetch-products';

export const CURRENT_REQUEST = 'CURRENT_REQUEST';
export const LAST_REQUEST_PAGE = 'LAST_REQUEST_PAGE';
export const LAST_RESPONSE_META = 'LAST_RESPONSE_META';
export const PRODUCTS = 'PRODUCTS';

const productsService = {
  [CURRENT_REQUEST]: null,
  [LAST_REQUEST_PAGE]: 0,
  [LAST_RESPONSE_META]: null,
  [PRODUCTS]: new Map(),
};

export default productsService;

/**
 * Get products' ordered IDs.
 *
 * @returns {string[]}
 */
export const getIds = () => Array.from(productsService[PRODUCTS].keys());

/**
 * Get product's index by ID.
 *
 * @param {string} id
 * @param {string[]} [ids] Collection of ordered IDs to iterate through.
 * Defaults to the products map's IDs.
 * @returns {number}
 */
export const getProductIndex = (id, ids) => (
  (!Array.isArray(ids) ? getIds() : ids).indexOf(id)
);

/**
 * Get next product's ID.
 *
 * @param {string} id
 * @returns {string} Next product's ID
 */
export const getNextProductId = (id) => {
  const ids = getIds();
  const index = ids.indexOf(id);

  return index >= 0 ? ids[index + 1] : undefined;
};

/**
 * Get previous product's ID.
 *
 * @param {string} id
 * @returns {string} Previous product's ID
 */
export const getPreviousProductId = (id) => {
  const ids = getIds();
  const index = ids.indexOf(id);

  return index >= 0 ? ids[index - 1] : undefined;
};

export const getProduct = (id) => {
  const product = productsService[PRODUCTS].get(id);

  if (!product) {
    return product;
  }

  // TODO: Account for bad id/key index lookups?
  const ids = getIds();
  const idKeyIndex = getProductIndex(id, ids);

  return Object.assign(
    {
      nextProductId: ids[idKeyIndex + 1],
      previousProductId: ids[idKeyIndex - 1],
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

const SCRIPTS_PATTERN = /<script.*?>.*?<\/script.*?>/gi;

/**
 * Sanitize product values.
 *
 * This removes `<script>...</script>` tags in a product's value to prevent
 * injection attacks when the values are injected into WebViews.
 *
 * @todo Strip `style` and `img` tags to prevent potential phishing/counters
 *
 * @param {Object} product
 * @returns {Object} Sanitized product
 */
export const sanitizeProduct = product => Object.keys(product).reduce(
  (memo, key) => {
    const value = product[key];
    /* eslint-disable no-param-reassign */
    memo[key] = typeof value === 'string' ?
      value.replace(SCRIPTS_PATTERN, '') :
      value;
    /* eslint-enable no-param-reassign */
    return memo;
  },
  {}
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
        // TODO: Optimize by only sanitizing loaded products' attributes
        productsService[PRODUCTS].set(
          product.productId,
          sanitizeProduct(product)
        );
      });

      return products;
    });

  return productsService[CURRENT_REQUEST];
};

