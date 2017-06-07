import 'react-native';
import flatten from 'flat';
import React from 'react';
import renderer from 'react-test-renderer';

import MiniList from '../../src/components/MiniList';
import mockProducts from '../mocks/products.json';

test('renders component', () => {
  const props = {
    isLoading: false,
    onEndReached() {
      return 'test!';
    },
    onProductPress() {
      return 'test!';
    },
    products: mockProducts,
  };
  const tree = renderer.create(<MiniList {...props} />);

  /**
   * Check for mock products' names in tree.
   *
   * @todo Convert to check for `<Mini />` component detection.
   * @todo Add better assertions
   */
  expect(Object.values(flatten(tree.toJSON())))
    .toEqual(expect.arrayContaining(mockProducts.map(p => p.productName)));
});

