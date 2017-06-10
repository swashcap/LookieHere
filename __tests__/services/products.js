import mockProducts from '../mocks/products.json';
import
  productsService,
  {
    CURRENT_REQUEST,
    getProduct,
    getProducts,
    hasLoadedAllProducts,
    LAST_RESPONSE_META,
    loadProducts,
    PRODUCTS,
  }
from '../../src/services/products';

/* eslint-disable import/no-named-as-default-member */
const addMockProducts = () => {
  mockProducts.forEach((product) => {
    productsService[PRODUCTS].set(product.productId, product);
  });
};

const removeMockProducts = () => productsService[PRODUCTS].clear();

describe('get products', () => {
  beforeEach(addMockProducts);
  afterEach(removeMockProducts);

  test('gets single product', () => {
    expect(getProduct(mockProducts[1].productId)).toEqual(Object.assign(
      {
        nextProductId: mockProducts[2].productId,
        previousProductId: mockProducts[0].productId,
      },
      mockProducts[1]
    ));
    expect(getProduct('bogus-id')).toBeUndefined();
  });

  test('gets all products', () => {
    expect(getProducts()).toEqual(mockProducts);
  });
});

describe('loads products from API', () => {
  test('checks if all products loaded', () => {
    expect(hasLoadedAllProducts()).toBe(false);

    productsService[LAST_RESPONSE_META] = {
      totalProducts: 200,
    };

    expect(hasLoadedAllProducts()).toBe(false);

    addMockProducts();

    expect(hasLoadedAllProducts()).toBe(false);

    productsService[LAST_RESPONSE_META] = {
      totalProducts: mockProducts.length,
    };

    expect(hasLoadedAllProducts()).toBe(true);

    productsService[LAST_RESPONSE_META] = null;
    removeMockProducts();
  });

  test('locks to  current request', () => {
    const currentRequest = {};

    expect.assertions(1);

    productsService[CURRENT_REQUEST] = currentRequest;

    expect(loadProducts()).toBe(currentRequest);

    productsService[CURRENT_REQUEST] = null;
  });

  test('empty when all fetched', () => {
    expect.assertions(1);

    addMockProducts();

    productsService[LAST_RESPONSE_META] = {
      totalProducts: mockProducts.length,
    };

    return loadProducts()
      .then((response) => {
        productsService[LAST_RESPONSE_META] = null;
        removeMockProducts();
        expect(response).toEqual([]);
      })
      .catch((error) => {
        productsService[LAST_RESPONSE_META] = null;
        removeMockProducts();
        throw error;
      });
  });
});
/* eslint-enable import/no-named-as-default-member */

