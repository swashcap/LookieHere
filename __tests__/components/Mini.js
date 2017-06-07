import 'react-native';
import flatten from 'flat';
import React from 'react';
import renderer from 'react-test-renderer';

import Mini from '../../src/components/Mini';
import mockProducts from '../mocks/products.json';

const product = mockProducts[0];

test('renders Mini component', () => {
  const onPressSpy = jest.fn();
  const tree = renderer.create(
    <Mini onPress={onPressSpy} {...product} />
  );

  /**
   * @todo Migrate to enzyme for easy assertions once it's ready for React 16+
   *
   * {@link http://airbnb.io/enzyme/}
   */
  const flat = Object.values(flatten(tree.toJSON()));

  expect(flat).toContain(product.price);
  expect(flat).toContain(product.productImage);
  expect(flat).toContain(product.productName);

  // TODO: Determine how to simulate `onPress`
});

test('adds \'Out of Stock\' text', () => {
  const props = Object.assign({}, product, {
    inStock: false,
    onPress() {
      return 'test!';
    },
  });
  const tree = renderer.create(<Mini {...props} />);

  // TODO: ENZYME!!!
  expect(Object.values(flatten(tree.toJSON()))).toContain('Out of Stock');
});

