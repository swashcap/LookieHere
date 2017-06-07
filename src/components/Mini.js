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
  },
  image: {
    height: 100,
    width: 100,
  },
  name: {
  },
  price: {
  },
  stock: {
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

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          {stock}
          <Text style={styles.name}>{productName}</Text>
          <Text style={styles.price}>{price}</Text>
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

