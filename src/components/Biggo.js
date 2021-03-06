import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  WebView,
} from 'react-native';

import loadingAnimation3 from '../images/loading-animation-3.gif';
import Panonav from './Panonav';

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: 60,
    zIndex: 2,
  },
  backButtonText: {
    color: 'white',
    fontFamily: 'Copperplate',
  },
  bottom: {
    backgroundColor: 'indigo',
  },
  container: {
    backgroundColor: 'indigo',
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  content: {
    flex: 1,
    position: 'relative',
    zIndex: 2,
  },
  image: {
    height: 100,
    width: 100,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: -1,
  },
  loadingImage: {
    height: 100,
    width: 100,
  },
  name: {
    color: 'white',
    flexShrink: 2,
    fontFamily: 'Times New Roman',
    fontSize: 18,
    fontWeight: '700',
    height: 18,
    lineHeight: 18,
    marginTop: 6,
    paddingLeft: 10,
    paddingRight: 60,
  },
  nameOutOfStock: {
    color: 'darksalmon',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  price: {
    backgroundColor: 'hotpink',

    /**
     * @todo Debug view stacking in Android so WebView doesn't layer on top of
     * price.
     */
    bottom: Platform.OS === 'ios' ? -10 : 5,
    color: 'lemonchiffon',
    fontFamily: 'Chalkboard SE',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 24,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 6,
    position: 'absolute',
    right: 5,
    transform: [{ rotate: '5deg' }],
  },
  stock: {
    backgroundColor: 'transparent',
    bottom: 10,
    color: 'red',
    fontFamily: 'Times New Roman',
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '700',
    left: 0,
    lineHeight: 22,
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
  },
  top: {
    flexDirection: 'row',
    paddingTop: 22,
    position: 'relative',
    width: '100%',
    zIndex: 2,
  },
});

/**
 * Biggo.
 * @module
 *
 * Displays a single product.
 */
export default class Biggo extends Component {

  /**
   * Get HTML for the WebView.
   *
   * @todo Better way to do this? Place in stylesheet?
   *
   * @param {Object} product
   * @param {string} [product.longDescription]
   * @param {string} product.productImage
   * @param {string} product.productName
   * @param {number} product.reviewCount
   * @param {number} product.reviewRating
   * @param {number} product.shortDescription
   * @returns {string}
   */
  static getWebViewHTML({
    longDescription,
    productImage,
    productName,
    reviewCount,
    reviewRating,
    shortDescription,
  }) {
    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html {
        background: linear-gradient(hotpink, indigo);
        color: white;
        font-family: 'Chalkboard SE';
        line-height: 1.25;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0
      }
      img {
        height: auto;
        width: 100%;
      }
      .name {
        background: indigo;
        font-family: 'Times New Roman';
        line-height: 1;
        margin: 0;
        padding: 1rem;
        text-align: center;
      }
      .description {
        font-size: 125%;
        font-weight: 400;
        line-height: 1.1;
        margin: 0 0 1rem;
      }
      .rating {
        background: indigo;
        color: pink;
        display: flex;
        justify-content: center;
        padding: .25rem 1rem 1rem;
        text-align: center;
      }
      .rating-stars {
        font-size: 120%;
        letter-spacing: .1em;
        position: relative;
        overflow: hidden;
      }
      .rating-stars:after {
        background: indigo;
        content: '☆☆☆☆☆';
        direction: rtl;
        display: block;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        width: ${reviewRating * 20}%;
      }
      .rating-count {
        padding-left: .5rem;
      }
      .content {
        padding: 1rem;
      }
    </style>
  </head>
  <body>
    <h1 class="name">${productName}</h1>
    <div class="rating">
      <div class="rating-stars">★★★★★</div>
      <div class="rating-count">
        ${reviewCount + (reviewCount === 1 ? ' review' : ' reviews')}
      </div>
    </div>
    <img src="${productImage}" />
    <div class="content">
      <h2 class="description">${shortDescription}</h2>
      ${longDescription}
    </div>
    <script>
      (function () {
        var headerHeight = document.querySelector('h1').offsetHeight;
        var lastScroll = 0;
        var ticking = false;

        window.addEventListener('scroll', function onScroll(event) {
          lastScroll = window.scrollY;
          if (!ticking) {
            window.requestAnimationFrame(function () {
              postMessage(
                lastScroll > 0.95 * headerHeight ? 'scrolled' : 'not-scrolled'
              );
              ticking = false;
            });
          }
          ticking = true;
        });
      })();
    </script>
  </body>
</html>`;
  }

  constructor(props) {
    super(props);

    this.state = {
      isTopAnimating: false,
      topCollapse: new Animated.Value(0),
    };

    this.animateTop = this.animateTop.bind(this);
    this.handleWebViewMessage = this.handleWebViewMessage.bind(this);
    this.renderBottom = this.renderBottom.bind(this);
    this.renderTop = this.renderTop.bind(this);
  }

  /**
   * Handle `postMessage` from WebView.
   *
   * {@link https://facebook.github.io/react-native/docs/webview.html#onmessage}
   *
   * @param {Object} event
   */
  handleWebViewMessage(event) {
    const { nativeEvent: { data } } = event;
    const { isTopAnimating, topCollapse } = this.state;

    if (!isTopAnimating) {
      if (data === 'scrolled' && topCollapse !== 1) {
        this.animateTop(1);
      } else if (data === 'not-scrolled' && topCollapse !== 0) {
        this.animateTop(0);
      }
    }
  }

  /**
   * Animate 'top' section to expand or collapse.
   *
   * @param {number} toValue Value to animate to: either `1` or `0`
   */
  animateTop(toValue) {
    this.setState({
      isTopAnimated: true,
      topCollapse: this.state.topCollapse,
    });

    Animated.timing(this.state.topCollapse, {
      duration: 400,
      toValue,
    }).start(() => this.setState({
      isTopAnimated: false,
      topCollapse: this.state.topCollapse,
    }));
  }

  /**
   * Render bottom WebView.
   *
   * @todo Use WKWebView? {@link https://github.com/facebook/react-native/issues/321}
   *
   * @returns {ReactNative.WebView}
   */
  renderBottom() {
    const {
      longDescription,
      productImage,
      productName,
      reviewCount,
      reviewRating,
      shortDescription,
    } = this.props;
    const html = Biggo.getWebViewHTML({
      longDescription,
      productImage,
      productName,
      reviewCount,
      reviewRating,
      shortDescription,
    });

    return (
      <WebView
        bounces
        decelerationRate={'normal'}
        javaScriptEnabled={false}
        onMessage={this.handleWebViewMessage}
        scalesPageToFit={false}
        scrollEnabled
        source={{ html }}
        style={styles.bottom}
      />
    );
  }

  /**
   * Render top elements.
   *
   * @returns {ReactNative.Animated.View}
   */
  renderTop() {
    const { inStock, onNavigateBack, productName, price } = this.props;
    const { topCollapse } = this.state;
    const stock = !inStock ?
      <Text style={styles.stock}>Out of Stock</Text> :
      undefined;

    const topStyle = StyleSheet.flatten([styles.top, {
      height: topCollapse.interpolate({
        inputRange: [0, 1],
        outputRange: [75, 55],
      }),
    }]);
    const nameStyle = StyleSheet.flatten([
      styles.name,
      (!inStock ? styles.nameOutOfStock : undefined),
      {
        opacity: topCollapse,
      },
    ]);

    return (
      <Animated.View style={topStyle}>
        <TouchableWithoutFeedback onPress={onNavigateBack}>
          <View style={styles.backButton}>
            <Text style={styles.backButtonText}>&lt; Back</Text>
          </View>
        </TouchableWithoutFeedback>
        <Animated.Text style={nameStyle}>
          {productName}
        </Animated.Text>
        <Text style={styles.price}>{price}</Text>
        {stock}
      </Animated.View>
    );
  }

  render() {
    const { onNavigateNext, onNavigatePrevious } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <Image
            source={loadingAnimation3}
            style={styles.loadingImage}
          />
        </View>
        <View style={styles.content}>
          <StatusBar
            backgroundColor="indigo"
            barStyle="light-content"
          />
          {this.renderTop()}
          <Panonav
            onPanLeft={onNavigateNext}
            onPanRight={onNavigatePrevious}
          >
            {this.renderBottom()}
          </Panonav>
        </View>
      </View>
    );
  }
}

Biggo.defaultProps = {
  longDescription: '',
  onNavigateNext: undefined,
  onNavigatePrevious: undefined,
};

Biggo.propTypes = {
  inStock: PropTypes.bool.isRequired,
  longDescription: PropTypes.string,
  onNavigateBack: PropTypes.func.isRequired,
  onNavigateNext: PropTypes.func,
  onNavigatePrevious: PropTypes.func,
  price: PropTypes.string.isRequired,
  productImage: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  reviewCount: PropTypes.number.isRequired,
  reviewRating: PropTypes.number.isRequired,
  shortDescription: PropTypes.string.isRequired,
};

