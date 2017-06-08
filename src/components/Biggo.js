import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  WebView,
} from 'react-native';

const styles = StyleSheet.create({
  backButton: {
    height: 60,
    width: 60,
  },
  body: {},
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    height: 100,
    width: 100,
  },
  longDescription: {
    backgroundColor: 'red',
    height: 200,
  },
  name: {},
  price: {},
  shortDescription: {},
  stock: {},
  top: {
    backgroundColor: 'lime',
  },
});


export default class Biggo extends Component {

  // TODO: Better way to do this? Place in stylesheet?
  static getWebViewHTML({ productImage, longDescription }) {
    return `<!doctype html>
<html>
  <head>
    <style>
      body {
        margin: 0
      }
      img {
        height: auto;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <img src="${productImage}" />
    ${longDescription}
  </body>
</html>`;
  }

  constructor(props) {
    super(props);
    this.renderBottom = this.renderBottom.bind(this);
    this.renderTop = this.renderTop.bind(this);
  }

  renderBottom() {
    const {
      longDescription,
      productImage,
      reviewCount,
      reviewRating,
      shortDescription,
    } = this.props;
    const html = Biggo.getWebViewHTML({
      longDescription,
      productImage,
      reviewCount,
      reviewRating,
      shortDescription,
    });

    return (
      <WebView
        bounces={false}
        decelerationRate={'normal'}
        javaScriptEnabled={false}
        scalesPageToFit={false}
        scrollEnabled={false}
        source={{ html }}
        style={styles.longDescription}
      />
    );
  }

  renderTop() {
    const { inStock, onBackPress, productName, price } = this.props;
    const stock = !inStock ?
      <Text style={styles.stock}>Out of Stock</Text> :
      undefined;

    return (
      <View style={styles.top}>
        <TouchableWithoutFeedback onPress={onBackPress}>
          <View style={styles.backButton}>
            <Text>←</Text>
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.name}>{productName}</Text>
        <Text style={styles.price}>{price}</Text>
        {stock}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderTop()}
        {this.renderBottom()}
      </View>
    );
  }
}

Biggo.propTypes = {
  inStock: PropTypes.bool.isRequired,
  longDescription: PropTypes.string.isRequired,
  onBackPress: PropTypes.func.isRequired,
  // onNextPress: PropTypes.func.isRequired,
  // onPreviousPress: PropTypes.func.isRequired,
  price: PropTypes.string.isRequired,
  productImage: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  reviewCount: PropTypes.number.isRequired,
  reviewRating: PropTypes.number.isRequired,
  shortDescription: PropTypes.string.isRequired,
};
