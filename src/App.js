import React, { Component } from 'react';

import Biggo from './components/Biggo';
import { apiBase, apiKey } from '../config/index.json';
import LoadingScreen from './components/LoadingScreen';
import MiniList from './components/MiniList';
import ErrorMessage from './components/ErrorMessage';

import {
  configure as configureProductsService,
  getProduct,
  getProductIdIterator,
  getProductIndex,
  getProducts,
  loadProducts,
} from './services/products';

configureProductsService({
  apiBase,
  apiKey,
  products: new Map(),
});

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoading: true,
      miniScrollOffset: null,
      products: getProducts(), // Returns an array
      product: null,
      productIterator: null,
      route: 'loading',
    };

    this.clearError = this.clearError.bind(this);
    this.displayError = this.displayError.bind(this);
    this.loadProducts = this.loadProducts.bind(this);
    this.navigateToBiggo = this.navigateToBiggo.bind(this);
    this.navigateToMini = this.navigateToMini.bind(this);
    this.navigateToNextProduct = this.navigateToNextProduct.bind(this);
    this.navigateToPreviousProduct = this.navigateToPreviousProduct.bind(this);
  }

  componentDidMount() {
    // Flaunt that loading screen
    return Promise.all([
      this.loadProducts(),
      new Promise(resolve => setTimeout(resolve, 1000)),
    ])
      .then(() => this.setState({
        route: 'mini',
      }));
  }

  setState(newState) {
    super.setState(Object.assign({}, this.state, newState));
  }

  clearError() {
    this.setState({
      error: null,
    });
  }

  displayError(error) {
    this.setState({
      error: error instanceof Error ? error.message : error,
    });
  }

  loadProducts() {
    this.setState({
      isLoading: true,
    });

    return loadProducts()
      .then((loadedProducts) => {
        this.setState({
          isLoading: false,
          products: this.state.products.concat(loadedProducts),
        });
      })
      .catch(this.displayError);
  }

  navigateToBiggo(product) {
    let productIterator;

    // `getProductIdIterator` throws if `product` is bad
    try {
      productIterator = getProductIdIterator(product);
    } catch (error) {
      return this.displayError(error);
    }

    return this.setState({
      product: productIterator.initial,
      productIterator,
      route: 'biggo',
    });
  }

  navigateToMini() {
    const {
      product: {
        value: productId,
      },
    } = this.state;
    const newState = {
      product: null,
      productIterator: null,
      route: 'mini',
    };

    /**
     * Ensure the `MiniList` component scrolls back to its previous position.
     *
     * @todo This approximates scroll offset based on the `MiniList` items'
     * approximate height. Improve this by listening to `MiniList` scroll events
     * and recording the last offset.
     */
    if (productId) {
      const productIndex = getProductIndex(productId);

      if (productIndex > -1) {
        newState.miniScrollOffset = productIndex * 100;
      }
    }

    this.setState(newState);
  }

  navigateToNextProduct() {
    this.setState({
      product: this.state.productIterator.next(),
    });
  }

  navigateToPreviousProduct() {
    this.setState({
      product: this.state.productIterator.previous(),
    });
  }

  render() {
    const {
      error,
      isLoading,
      miniScrollOffset,
      products,
      product,
      route,
    } = this.state;

    if (error) {
      return (
        <ErrorMessage
          onClose={this.clearError}
          message={error}
        />
      );
    }

    switch (route) {
      case 'mini':
        return (
          <MiniList
            initialScrollOffset={miniScrollOffset}
            isLoading={isLoading}
            onEndReached={this.loadProducts}
            onProductPress={this.navigateToBiggo}
            products={products}
          />
        );
      case 'biggo':
        return (
          <Biggo
            onNavigateBack={this.navigateToMini}
            onNavigateNext={product.hasNext ?
              this.navigateToNextProduct :
              undefined
            }
            onNavigatePrevious={product.hasPrevious ?
              this.navigateToPreviousProduct :
              undefined
            }
            {...getProduct(product.value)}
          />
        );
      default:
        return <LoadingScreen />;
    }
  }
}

