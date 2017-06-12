import React, { Component } from 'react';
import { View } from 'react-native';

jest.genMockFromModule('../MiniList');

export default class MockMiniList extends Component {
  render() {
    return <View />;
  }
}

