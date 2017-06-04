import config from '../../config/index.json';
import
  products,
  {
    fetchProducts,
    MAP_KEY,
  }
from '../../src/services/products';

const mockProducts = [{
  productId: 1,
  productName: 'Test product 1',
}, {
  productId: 2,
  productName: 'Test product 2',
}];

describe('fetchs products from API', () => {
  const errorStatusCode = 404;
  const errorStatusText = 'Where it go?';

  beforeAll(() => {
    global.fetch = jest
      .fn(() => Promise.resolve({
        ok: true,
        json() {
          return Promise.resolve({
            products: mockProducts,
          });
        },
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: false,
        status: errorStatusCode,
        statusText: errorStatusText,
      }));
  });
  afterAll(() => {
    delete global.fetch;
  });

  test('handles errors', () => {
    expect.assertions(2);

    return fetchProducts(1, 30).catch((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch(
        new RegExp(`${errorStatusCode}.*${errorStatusText}`)
      );
    });
  });
  test('returns products', () => {
    expect.assertions(3);

    return fetchProducts(2, 30).then((response) => {
      const arg = global.fetch.mock.calls[global.fetch.mock.calls.length - 1][0];

      expect(arg).toMatch(new RegExp(`${config.apiBase}.*${config.apiKey}`));
      expect(arg).toMatch(/2\/30$/);
      expect(response.products).toBe(mockProducts);
    });
  });
});

describe('get products', () => {
  /* eslint-disable import/no-named-as-default-member */
  beforeEach(() => {
    mockProducts.forEach((product) => {
      products[MAP_KEY].set(product.productId, product);
    });
  });
  afterEach(() => products[MAP_KEY].clear());
  /* eslint-enable import/no-named-as-default-member */

  test('gets single product', () => {
    expect(
      products.getProduct(mockProducts[0].productId)
    ).toBe(mockProducts[0]);
    expect(products.getProduct('bogus-id')).toBeUndefined();
  });
});

