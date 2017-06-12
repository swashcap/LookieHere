import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

export default class MiniListBackgroundAndroid extends Component {
  render() {
    return (
      <View style={this.props.style} />
    );
  }
}

MiniListBackgroundAndroid.defaultProps = {
  style: {},
};

MiniListBackgroundAndroid.propTypes = {
  style: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object, // eslint-disable-line react/forbid-prop-types
  ]),
};

