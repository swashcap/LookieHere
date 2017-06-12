import 'react-native';
import React from 'react';
import Index from '../index.android';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'; // eslint-disable-line

jest.mock('../src/services/products');
jest.mock('../src/components/Biggo');
jest.mock('../src/components/LoadingScreen');
jest.mock('../src/components/MiniList');

test('renders correctly', () => {
  renderer.create(
    <Index />
  );
});
