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
    const sanitizedURL = 'http://localhost:wat';
    expect.assertions(4);

    return fetchProducts('http://localhost', sanitizedURL).catch((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toMatch(new RegExp(sanitizedURL));
      expect(error.message).toMatch(new RegExp(errorStatusCode));
      expect(error.message).toMatch(new RegExp(errorStatusText));
    });
  });
  test('returns products', () => {
    const url = 'http://localhost:3000/rando-api/path/its-so/crazy';
    expect.assertions(2);

    return fetchProducts(url).then((response) => {
      const arg = global.fetch.mock.calls[global.fetch.mock.calls.length - 1][0];

      expect(arg).toBe(url);
      expect(response.products).toBe(mockProducts);
    });
  });
});
