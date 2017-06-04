import React, { Component } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';

import loadingAnimation from '../images/loading-animation.gif';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 36,
  },
  image: {
    height: 82,
    marginLeft: 10,
    marginRight: 15,
    width: 56,
  },
  wrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
  },
});

export default class LoadingScreen extends Component {
  constructor() {
    super();

    this.state = {
      textColor: new Animated.Value(0),
    };
    this.animateTextColor = this.animateTextColor.bind(this);
  }

  componentWillMount() {
    this.animateTextColor();
  }

  animateTextColor() {
    Animated.sequence([
      Animated.timing(this.state.textColor, {
        duration: 1000,
        easing: Easing.linear,
        toValue: 1,
      }),
      Animated.timing(this.state.textColor, {
        duration: 100,
        easing: Easing.linear,
        toValue: 0,
      }),
    ]).start((event) => {
      if (event.finished) {
        this.animateTextColor();
      }
    });
  }

  render() {
    const color = this.state.textColor.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [
        'rgb(255, 0, 0)',
        'rgb(255, 255, 0)',
        'rgb(0, 255, 0)',
        'rgb(0, 255, 255)',
        'rgb(0, 0, 255)',
        'rgb(255, 0, 255)',
      ],
    });
    const textStyle = {
      color,
      fontFamily: 'Courier New',
      fontSize: 20,
      fontWeight: '700',
    };
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <Text style={styles.emoji}>🍕</Text>
          <Image
            source={loadingAnimation}
            style={styles.image}
          />
          <Text style={styles.emoji}>🌭</Text>
        </View>
        <Animated.Text style={textStyle}>
          Loading…
        </Animated.Text>
      </View>
    );
  }
}
