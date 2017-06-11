import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import errorIcon from '../images/error-icon.png';

const styles = StyleSheet.create({
  body: {
    flexDirection: 'row',
    paddingBottom: 12,
    paddingLeft: 11,
    paddingRight: 11,
    paddingTop: 10,
  },
  bodyButton: {
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 15,
    shadowColor: 'black',
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    width: 90,
  },
  bodyButtonInner: {
    borderStyle: 'dotted',
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 2,
  },
  bodyButtonText_1: {
    fontFamily: 'Verdana',
    fontSize: 12,
    lineHeight: 12,
    textDecorationColor: 'black',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  bodyButtonText_2: {
    fontFamily: 'Verdana',
    fontSize: 12,
    lineHeight: 12,
  },
  bodyButtonOuter: {
    borderBottomColor: '#808080',
    borderLeftColor: 'white',
    borderRightColor: '#808080',
    borderStyle: 'solid',
    borderTopColor: 'white',
    borderWidth: 1,
    paddingBottom: 1,
    paddingLeft: 2,
    paddingRight: 1,
    paddingTop: 2,
  },
  bodyText: {
    flexShrink: 1,
  },
  container: {
    backgroundColor: '#128483',
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 40,
  },
  containerInner: {
    borderBottomColor: '#808080',
    borderLeftColor: 'white',
    borderRightColor: '#808080',
    borderStyle: 'solid',
    borderTopColor: 'white',
    borderWidth: 1,
    padding: 1,
  },
  containerOuter: {
    backgroundColor: '#c0c0c0',
    borderBottomColor: 'black',
    borderLeftColor: '#c0c0c0',
    borderRightColor: 'black',
    borderStyle: 'solid',
    borderTopColor: '#c0c0c0',
    borderWidth: 1,
  },
  header: {
    backgroundColor: '#020c7e',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
    paddingBottom: 3,
    paddingLeft: 4,
    paddingRight: 3,
  },
  headerButton: {
    backgroundColor: '#c0c0c0',
    borderBottomColor: '#808080',
    borderLeftColor: 'white',
    borderRightColor: '#808080',
    borderStyle: 'solid',
    borderTopColor: 'white',
    borderWidth: 1,
    height: 11,
    shadowColor: 'black',
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    width: 13,
  },
  headerText: {
    color: 'white',
    fontFamily: 'Verdana',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 11,
  },
  headerButtonText: {
    backgroundColor: 'transparent',
    fontFamily: 'Menlo',
    fontSize: 11,
    lineHeight: 11,
    textAlign: 'center',
  },
  icon: {
    height: 32,
    marginRight: 10,
    width: 32,
  },
  message: {
    fontFamily: 'Verdana',
    fontSize: 12,
    lineHeight: 14,
    paddingTop: 2,
  },
});

export default class ErrorMessage extends Component {
  render() {
    const { onClose, message } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.containerOuter}>
          <View style={styles.containerInner}>
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.headerText}>LookieHere</Text>
                <View style={styles.headerButton}>
                  <Text style={styles.headerButtonText}>
                    ×
                  </Text>
                </View>
              </View>
              <View style={styles.body}>
                <Image
                  source={errorIcon}
                  style={styles.icon}
                />
                <View style={styles.bodyText}>
                  <Text style={styles.message}>
                    {message}
                  </Text>
                  <TouchableOpacity onPress={onClose}>
                    <View style={styles.bodyButton}>
                      <View style={styles.bodyButtonOuter}>
                        <View style={styles.bodyButtonInner}>
                          <Text style={styles.bodyButtonText_1}>C</Text>
                          <Text style={styles.bodyButtonText_2}>lose</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

ErrorMessage.propTypes = {
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

