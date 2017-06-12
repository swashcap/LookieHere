import React, { Component } from 'react';
import { View } from 'react-native';

jest.genMockFromModule('../Biggo');

export default class MockMiniList extends Component {
  render() {
    return <View />;
  }
}
