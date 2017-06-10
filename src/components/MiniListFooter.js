import React, { Component } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import footer1 from '../images/footer-1.gif';
import footer2 from '../images/footer-2.gif';

const styles = StyleSheet.create({
  bottom: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
  },
  container: {
    backgroundColor: 'white',
    paddingBottom: 20,
    paddingTop: 30,
  },
  counter: {
    flexShrink: 2,
  },
  counterNumbers: {
    backgroundColor: 'black',
    alignContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 2,
  },
  counterNumber: {
    backgroundColor: 'darkgreen',
    color: 'lime',
    fontFamily: 'DIN Condensed',
    fontSize: 32,
    lineHeight: 30,
    marginLeft: 1,
    marginRight: 1,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 8,
    textAlign: 'center',
  },
  counterText: {
    fontFamily: 'Times New Roman',
    fontSize: 18,
    lineHeight: 18,
    marginBottom: 4,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 25,
  },
  image_1: {
    height: 35,
    marginLeft: 10,
    marginRight: 15,
    width: 166,
  },
  image_2: {
    height: 62,
    marginLeft: 25,
    width: 100,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default class MiniListFooter extends Component {
  render() {
    return (

      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.counter}>
            <Text style={styles.counterText}>You are visitor #:</Text>
            <View style={styles.counterNumbers}>
              <Text style={styles.counterNumber}>0</Text>
              <Text style={styles.counterNumber}>0</Text>
              <Text style={styles.counterNumber}>0</Text>
              <Text style={styles.counterNumber}>2</Text>
              <Text style={styles.counterNumber}>8</Text>
              <Text style={styles.counterNumber}>7</Text>
            </View>
          </View>
          <Image
            source={footer2}
            style={styles.image_2}
          />
        </View>
        <View style={styles.bottom}>
          <Text style={styles.emoji}>🌭</Text>
          <Image
            source={footer1}
            style={styles.image_1}
          />
          <Text style={styles.emoji}>🍕</Text>
        </View>
      </View>
    );
  }
}

