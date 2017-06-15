/**
 * Separate test for `productService.loadProducts` to work around modules'
 * module loading `require`/IIFE strangeness in Webpack.
 */

const fetchProducts = require('../../src/services/fetch-products.js');
const mockProducts = require('../mocks/products.json');
const {
  configure: configureProductsService,
  loadProducts,
} = require('../../src/services/products.js');

const apiBase = 'http://localhot:stuff/suppp';
const apiKey = 'so-essential-to-requests';
const pageNumber = 888;
const totalProducts = mockProducts.length * 2;

const fetchProductsMock = jest.fn(() => Promise.resolve({
  pageNumber,
  products: mockProducts,
  totalProducts,
}));
const originalDefault = fetchProducts.default;
const products = new Map();

configureProductsService({
  apiBase,
  apiKey,
  products,
});

beforeAll(() => {
  fetchProducts.default = fetchProductsMock;
});

test('loads products', () => {
  expect.assertions(6);

  return loadProducts()
    .then((response) => {
      expect(response).toEqual(mockProducts);
      /* eslint-disable no-underscore-dangle */
      expect(loadProducts.__lastResponseMeta)
        .toEqual({
          pageNumber,
          totalProducts,
        });
      expect(Array.from(products.values())).toEqual(mockProducts);
      expect(loadProducts.__lastRequestPage).toBe(1);
      expect(loadProducts.__currentRequest).toBeNull();
      /* eslint-enable no-underscore-dangle */
      expect(fetchProductsMock.mock.calls[0][0]).toMatch(
        new RegExp(`^${apiBase}/${apiKey}/\\d/\\d+$`)
      );
    });
});

afterAll(() => {
  fetchProducts.default = originalDefault;
  products.clear();
});

