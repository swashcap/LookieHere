import mockProducts from '../mocks/products.json';
import
  productsService,
  {
    getProduct,
    getProducts,
    PRODUCTS,
  }
from '../../src/services/products';

describe('get products', () => {
  /* eslint-disable import/no-named-as-default-member */
  beforeEach(() => {
    mockProducts.forEach((product) => {
      productsService[PRODUCTS].set(product.productId, product);
    });
  });
  afterEach(() => productsService[PRODUCTS].clear());
  /* eslint-enable import/no-named-as-default-member */

  test('gets single product', () => {
    expect(getProduct(mockProducts[0].productId)).toBe(mockProducts[0]);
    expect(getProduct('bogus-id')).toBeUndefined();
  });

  test('gets all products', () => {
    expect(getProducts()).toEqual(mockProducts);
  });
});

