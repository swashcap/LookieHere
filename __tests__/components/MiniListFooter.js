import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import MiniListFooter from '../../src/components/MiniListFooter';

test('renders MiniListFooter component', () => {
  renderer.create(<MiniListFooter />);
});

