import mockProducts from '../../../__tests__/mocks/products.json';

const products = jest.genMockFromModule('../products');

products.getIds = jest.fn(() => mockProducts.map(({ productId }) => productId));
products.getNextProductId = jest.fn(() => undefined);
products.getPreviousProductId = jest.fn(() => undefined);
products.getProduct = jest.fn(id => mockProducts.find(
  ({ productId }) => productId === id
));
products.getProductIndex = jest.fn(id => mockProducts.findIndex(
  ({ productId }) => productId === id
));
products.getProducts = jest.fn(() => mockProducts);
products.hasLoadedAllProducts = jest.fn(() => true);
products.loadProducts = jest.fn(() => Promise.resolve(mockProducts));

module.exports = products;

