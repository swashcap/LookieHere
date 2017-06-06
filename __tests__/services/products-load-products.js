/**
 * Separate test for `productService.loadProducts` to work around modules'
 * module loading `require`/IIFE strangeness in Webpack.
 */

const fetchProducts = require('../../src/services/fetch-products.js');
const mockProducts = require('../mocks/products.json');
const productsService = require('../../src/services/products.js');

const pageNumber = 888;
const totalProducts = mockProducts.length * 2;

const fetchProductsMock = jest.fn(() => Promise.resolve({
  pageNumber,
  products: mockProducts,
  totalProducts,
}));
const originalDefault = fetchProducts.default;

beforeAll(() => {
  fetchProducts.default = fetchProductsMock;
});

test('loads products', () => {
  expect.assertions(6);

  return productsService.loadProducts()
    .then((response) => {
      expect(response).toEqual(mockProducts);
      expect(productsService.default[productsService.LAST_RESPONSE_META])
        .toEqual({
          pageNumber,
          totalProducts,
        });
      expect(
        Array.from(productsService.default[productsService.PRODUCTS].values())
      )
        .toEqual(mockProducts);
      expect(productsService.default[productsService.LAST_REQUEST_PAGE])
        .toBe(1);
      expect(productsService.default[productsService.CURRENT_REQUEST])
        .toBeNull();
      expect(fetchProductsMock).toHaveBeenCalled();
    });
});

afterAll(() => {
  fetchProducts.default = originalDefault;
});

