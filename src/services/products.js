import fetchProducts from './fetch-products';

const SCRIPTS_PATTERN = /<script.*?>.*?<\/script.*?>/gi;

let apiBase = null;
let apiKey = null;
let products = null;

/**
 * Configure the products service.
 *
 * @param {Object} options
 * @param {string} options.apiBase
 * @param {string} options.apiKey
 * @param {Map} options.products
 */
export const configure = ({
  apiBase: base,
  apiKey: key,
  products: productsMap,
}) => {
  apiBase = base;
  apiKey = key;
  products = productsMap;
};

/**
 * Get products' ordered IDs.
 *
 * @returns {string[]}
 */
export const getIds = () => Array.from(products.keys());

/**
 * Get product's index by ID.
 *
 * @param {string} id
 * @param {string[]} [ids] Collection of ordered IDs to iterate through.
 * Defaults to the products map's IDs.
 * @returns {number}
 */
export const getProductIndex = (id, ids) =>
  (!Array.isArray(ids) ? getIds() : ids).indexOf(id);

/**
 * Get a product iterator.
 *
 * Use an iterator-like interface for moving forward or backward through product
 * IDs in the order they were returned via the API.
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol}
 *
 * @example
 * const myIterator = getProductIdIterator('102');
 *
 * console.log(myIterator.next().value); // '103'
 * console.log(myIterator.next().value); // '104'
 * console.log(myIterator.next().done); // true
 * console.log(myIterator.previous().value); // '104'
 *
 * @param {string} id Initial product ID
 * @returns {Object} Iterator-like interface for proceeding through product IDs
 */
export const getProductIdIterator = (id) => {
  const ids = getIds();
  let currentIndex = ids.indexOf(id);

  if (currentIndex < 0) {
    throw new Error(`Product ID "${id}" not found`);
  }

  const getValue = incrementor => () => {
    if (
      currentIndex + incrementor < ids.length &&
      currentIndex + incrementor >= 0
    ) {
      currentIndex += incrementor;
    }

    return {
      hasNext: currentIndex + incrementor < ids.length,
      hasPrevious: currentIndex + incrementor >= 0,
      value: ids[currentIndex],
    };
  };

  return {
    initial: {
      hasNext: currentIndex + 1 < ids.length,
      hasPrevious: currentIndex - 1 >= 0,
      value: id,
    },
    next: getValue(1),
    previous: getValue(-1),
  };
};

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
  const product = products.get(id);

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

export const getProducts = () => Array.from(products.values());

/**
 * Sanitize product values.
 * @private
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
 * @returns {Promise<Object[],Error>}
 */
export const loadProducts = (() => {
  let currentRequest = null;
  let lastRequestPage = 0;
  let lastResponseMeta = null;

  const fn = () => {
    if (currentRequest) {
      return currentRequest;
    /* eslint-disable no-use-before-define */
    } else if (hasLoadedAllProducts()) {
    /* eslint-enable no-use-before-define */
      return Promise.resolve([]);
    }

    currentRequest = fetchProducts(
      `${apiBase}/${apiKey}/${lastRequestPage + 1}/30`,
      `${apiBase}/.../${lastRequestPage + 1}/30`
    )
      .then(({ pageNumber, products: newProducts, totalProducts }) => {
        lastResponseMeta = { pageNumber, totalProducts };
        currentRequest = null;
        lastRequestPage += 1;

        newProducts.forEach((product) => {
          // TODO: Optimize by only sanitizing loaded products' attributes
          products.set(
            product.productId,
            sanitizeProduct(product)
          );
        });

        // TODO: Return sanitized products
        return newProducts;
      });

    return currentRequest;
  };

  Object.defineProperties(fn, {
    __currentRequest: {
      get() {
        return currentRequest;
      },
      set(value) {
        currentRequest = value;
        return value;
      },
      writeable: true,
    },
    __lastRequestPage: {
      get() {
        return lastRequestPage;
      },
      set(value) {
        lastRequestPage = value;
        return value;
      },
      writeable: true,
    },
    __lastResponseMeta: {
      get() {
        return lastResponseMeta;
      },
      set(value) {
        lastResponseMeta = value;
        return value;
      },
      writeable: true,
    },
  });

  return fn;
})();

/* eslint-disable no-underscore-dangle */
export function hasLoadedAllProducts() {
  return !!(
    loadProducts.__lastResponseMeta &&
    products.size &&
    loadProducts.__lastResponseMeta.totalProducts <= products.size
  );
}
/* eslint-enable no-underscore-dangle */
