import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import App from '../src/App';
import mockProducts from './mocks/products.json';

jest.mock('../src/services/products');

/**
 * @todo Figure out why MiniList's ListView explodes when testing. In the
 * meantime, mock all the things.
 *
 * {@link https://github.com/facebook/jest/issues/1398}
 * {@link https://github.com/facebook/jest/issues/1398#issuecomment-239172001}
 */
jest.mock('../src/components/Biggo');
jest.mock('../src/components/LoadingScreen');
jest.mock('../src/components/MiniList');

describe('basic component', () => {
  test('renders', () => {
    // TODO: Determine how to test after initial `componentDidMount` fires
    renderer.create(<App />);
  });

  test('loads products on mount', () => {
    const mocks = {
      loadProducts: jest.fn(() => Promise.resolve()),
      setState: jest.fn(),
    };

    expect.assertions(2);

    return App.prototype.componentDidMount.apply(mocks)
      .then(() => {
        expect(mocks.loadProducts.mock.calls.length).toBe(1);
        expect(mocks.setState.mock.calls[0][0]).toEqual({
          route: 'mini',
        });
      });
  });

  // TODO: Figure out how to override `super`
  test.skip('set state override', () => {
    const that = {};
    that.state = {
      some: 'stuff',
      never: ['changes'],
    };
    const newState = {
      some: 'new-stuff',
      yo: 'new-stuff-also',
    };

    that.prototype.setState = jest.fn();

    App.prototype.setState.call(that, newState);

    expect(that.prototype.setState.mock.calls[0][0])
      .toEqual({
        some: 'new-Stuff',
        never: ['changes'],
        yo: 'new-stuff-also',
      });
  });

  test('load products', () => {
    const that = {
      state: {
        products: [],
      },
      setState: jest.fn(),
    };

    expect.assertions(3);

    return App.prototype.loadProducts.apply(that).then(() => {
      const calls = that.setState.mock.calls;

      expect(calls[0][0].isLoading).toBeTruthy();
      expect(calls[1][0].isLoading).toBeFalsy();
      expect(calls[1][0].products.length).toBeGreaterThan(1);
    });
  });
});

describe('navigation', () => {
  test('navigates to single product', () => {
    const productId = 'some-random-product';
    const that = {
      setState: jest.fn(),
    };

    App.prototype.navigateToBiggo.call(that, productId);

    const newState = that.setState.mock.calls[0][0];

    expect(newState.product.value).toBe(productId);
    expect(newState.productIterator.next).toBeInstanceOf(Function);
    expect(newState.productIterator.previous).toBeInstanceOf(Function);
    expect(newState.route).toBe('biggo');
  });

  test('navigates to list', () => {
    const that = {
      setState: jest.fn(),
    };

    App.prototype.navigateToMini.call(Object.assign(
      {
        state: {
          product: {
            value: 'rando-identifier-is-baller',
          },
        },
      },
      that
    ));

    expect(that.setState.mock.calls[0][0]).toEqual({
      product: null,
      productIterator: null,
      route: 'mini',
    });

    App.prototype.navigateToMini.call(Object.assign(
      {
        state: {
          product: {
            value: mockProducts[2].productId,
          },
        },
      },
      that
    ));

    expect(that.setState.mock.calls[1][0]).toEqual({
      miniScrollOffset: 200,
      product: null,
      productIterator: null,
      route: 'mini',
    });
  });

  test('next', () => {
    const that = {
      setState: jest.fn(),
      state: {
        productIterator: {
          next: jest.fn(() => 'wat'),
        },
      },
    };

    App.prototype.navigateToNextProduct.call(that);

    expect(that.state.productIterator.next).toHaveBeenCalled();
    expect(that.setState).toHaveBeenCalledWith({
      product: 'wat',
    });
  });

  test('previous', () => {
    const that = {
      setState: jest.fn(),
      state: {
        productIterator: {
          previous: jest.fn(() => 'waaat'),
        },
      },
    };

    App.prototype.navigateToPreviousProduct.call(that);

    expect(that.state.productIterator.previous).toHaveBeenCalled();
    expect(that.setState).toHaveBeenCalledWith({
      product: 'waaat',
    });
  });
});

