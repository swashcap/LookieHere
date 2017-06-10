import config from '../../config/index.json';
import fetchProducts from '../../src/services/fetch-products';
import mockProducts from '../mocks/products.json';

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
    expect.assertions(2);

    return fetchProducts(2, 30).then((response) => {
      const arg = global.fetch.mock.calls[global.fetch.mock.calls.length - 1][0];

      expect(arg).toBe(`${config.apiBase}/${config.apiKey}/2/30`);
      expect(response.products).toBe(mockProducts);
    });
  });
});
