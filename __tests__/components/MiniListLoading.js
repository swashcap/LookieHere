import 'react-native';
import flatten from 'flat';
import React from 'react';
import renderer from 'react-test-renderer';

import MiniListLoading from '../../src/components/MiniListLoading';

test('renders component', () => {
  const tree = renderer.create(<MiniListLoading />);
  expect(Object.values(flatten(tree.toJSON()))).toContain('Loading...');
});

