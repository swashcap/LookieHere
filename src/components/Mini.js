import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  image: {
    height: 100,
    width: 100,
  },
  name: {
    backgroundColor: 'transparent',
    fontFamily: 'Times New Roman',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 5,
  },
  nameOutOfStock: {
    color: 'salmon',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  price: {
    backgroundColor: 'hotpink',
    color: 'lemonchiffon',
    fontFamily: 'Chalkboard SE',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 20,
    paddingBottom: 4,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 6,
    position: 'absolute',
    right: 10,
    textAlign: 'center',
    top: 10,
    transform: [{ rotate: '5deg' }],
  },
  stock: {
    backgroundColor: 'transparent',
    color: 'red',
    fontFamily: 'Times New Roman',
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: '700',
    left: 38,
    lineHeight: 28,
    position: 'absolute',
    top: 35,
  },
  top: {
    position: 'relative',
  },
});

export default class Mini extends Component {
  render() {
    const {
      inStock,
      onPress,
      price,
      productImage,
      productName,
    } = this.props;

    const stock = !inStock ?
      <Text style={styles.stock}>Out of Stock</Text> :
      undefined;
    const nameStyles = !inStock ?
      StyleSheet.flatten([styles.name, styles.nameOutOfStock]) :
      styles.name;

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Text style={nameStyles}>{productName}</Text>
          <Text style={styles.price}>{price}</Text>
          {stock}
          <Image
            source={{ uri: productImage }}
            style={styles.image}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

Mini.propTypes = {
  inStock: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  price: PropTypes.string.isRequired,
  productImage: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
};

