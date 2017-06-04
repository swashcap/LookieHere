import 'react-native';
import React from 'react';
import Index from '../index.ios';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'; // eslint-disable-line

test('renders correctly', () => {
  renderer.create(
    <Index />
  );
});
