import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import LoadingScreen from '../../src/components/LoadingScreen';

test('renders loading component', () => {
  const tree = renderer.create(<LoadingScreen />);
  /**
   * @todo Migrate to enzyme for easy assertions once it's ready for React 16+
   *
   * {@link http://airbnb.io/enzyme/}
   */
  expect(tree.toJSON().children[1].children[0]).toMatch(/Loading/);
});

