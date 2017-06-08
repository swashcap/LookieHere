import 'react-native';
import flatten from 'flat';
import React from 'react';
import renderer from 'react-test-renderer';

import Biggo from '../../src/components/Biggo';
import mockProducts from '../mocks/products.json';

const product = mockProducts[0];

/**
 * @todo Disable when Jest mocks WebViews properly.
 * {@link https://github.com/facebook/react-native/issues/12440#issuecomment-282184173}
 */
jest.unmock('ScrollView');

test('renders Biggo component', () => {
  const noop = () => 'test!';
  const props = Object.assign({}, product, {
    onBackPress: noop,
    onNextPress: noop,
    onPreviousPress: noop,
  });

  const tree = renderer.create(<Biggo {...props} />);
  const flat = Object.values(flatten(tree.toJSON()));

  expect(flat).toContain(product.productName);
  expect(flat).toContain(product.price);
});

