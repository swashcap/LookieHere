import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
} from 'react-native';

const { width: windowWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/**
 * Panonav
 * @module
 *
 * Trigger functions passed as props when horizontal panning passes a threshold.
 *       ____
 *      / __ \ ____ _ ____   ____   ____   ____ _ _   __
 *     / /_/ // __ `// __ \ / __ \ / __ \ / __ `/| | / /
 *    / ____// /_/ // / / // /_/ // / / // /_/ / | |/ /
 *   /_/     \__,_//_/ /_/ \____//_/ /_/ \__,_/  |___/
 *
 */
export default class Panonav extends Component {
  static getTrue() {
    return true;
  }

  constructor(props) {
    super(props);

    this.state = {
      pan: new Animated.ValueXY(),
    };

    this.onPanResponderMove = this.onPanResponderMove.bind(this);
    this.onPanResponderRelease = this.onPanResponderRelease.bind(this);
  }

  /**
   * Register a `PanResponder` instance:
   * {@link https://facebook.github.io/react-native/docs/panresponder.html#basic-usage}
   */
  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: Panonav.getTrue,
      onMoveShouldSetPanResponderCapture: Panonav.getTrue,
      onPanResponderMove: this.onPanResponderMove,
      onPanResponderRelease: this.onPanResponderRelease,
      onPanResponderTerminationRequest: Panonav.getTrue,
      onShouldBlockNativeResponder: Panonav.getTrue,
      onStartShouldSetPanResponder: Panonav.getTrue,
      onStartShouldSetPanResponderCapture: Panonav.getTrue,
    });
  }

  /**
   * Assume new props means a new product, reset to center.
   *
   * @todo Remove blank screen jank
   */
  componentWillReceiveProps() {
    this.state.pan.setValue({
      x: 0,
      y: 0,
    });
  }

  /**
   * Transorm `gestureState` changes onto `this.state.pan` using the
   * `Animated.event` method:
   * {@link https://facebook.github.io/react-native/docs/animated.html#event}
   */
  onPanResponderMove(event, gestureState) {
    return Animated.event([{
      dx: this.state.pan.x,
      dy: this.state.pan.y,
    }])(gestureState);
  }

  /**
   * Intelligently respond to touch releases:
   *
   *   * If horizontal distance is < 25% screen dimension: spring back
   *   * If dx is positive: navigate to next item
   *   * If dx is negative: navigate to previous item
   *   * TODO: give touch starts near screen edge more 'weight'?
   *   * TODO: Use `gestureState`s `vx` velocity property?
   *
   * {@link https://facebook.github.io/react-native/docs/panresponder.html}
   *
   * @param {SyntheticEvent} event
   * @param {Object} gestureState
   */
  onPanResponderRelease(event, gestureState) {
    if (Math.abs(gestureState.dx) > windowWidth * 0.25) {
      if (gestureState.dx > 0) {
        Animated.spring(this.state.pan, {
          toValue: {
            x: 2 * windowWidth,
            y: 0,
          },
        }).start(this.props.onPanRight);
      } else {
        Animated.spring(this.state.pan, {
          toValue: {
            x: -2 * windowWidth,
            y: 0,
          },
        }).start(this.props.onPanLeft);
      }
    } else {
      Animated.spring(this.state.pan, {
        toValue: {
          x: 0,
          y: 0,
        },
      }).start();
    }
  }

  render() {
    // If horontal distance is < 10% of screen dimension: do nothing
    const style = {
      flex: 1,
      transform: [{
        translateX: this.state.pan.x.interpolate({
          inputRange: [-100, -15, 0, 15, 100],
          outputRange: [-50, 0, 0, 0, 50],
        }),
      }],
    };

    return (
      <View
        style={styles.container}
        {...this.panResponder.panHandlers}
      >
        <Animated.View style={style}>
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
}

Panonav.propTypes = {
  children: PropTypes.element.isRequired,
  onPanLeft: PropTypes.func.isRequired,
  onPanRight: PropTypes.func.isRequired,
};

