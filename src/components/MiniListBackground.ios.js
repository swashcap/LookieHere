import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, View } from 'react-native';

import listBackground from '../images/list-background.png';

const styles = StyleSheet.create({
  image: {
    height: '100%',
    resizeMode: 'repeat',
    width: '100%',
  },
});

export default class MiniListBackgroundIOS extends Component {
  render() {
    return (
      <View style={this.props.style}>
        <Image
          source={listBackground}
          style={styles.image}
        />
      </View>
    );
  }
}

MiniListBackgroundIOS.defaultProps = {
  style: {},
};

MiniListBackgroundIOS.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object, // eslint-disable-line react/forbid-prop-types
  ]),
};

