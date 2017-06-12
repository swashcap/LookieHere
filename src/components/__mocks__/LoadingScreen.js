import React, { Component } from 'react';
import { View } from 'react-native';

jest.genMockFromModule('../LoadingScreen');

export default class MockMiniList extends Component {
  render() {
    return <View />;
  }
}
