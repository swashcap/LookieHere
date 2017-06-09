import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import loadingAnimation from '../images/loading-animation-2.gif';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    paddingBottom: 20,
    paddingTop: 20,
  },
  image: {
    height: 50,
    marginBottom: 10,
    width: 80,
  },
  text: {
    fontFamily: 'Courier New',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default class MiniListLoading extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={loadingAnimation}
          style={styles.image}
        />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }
}

