import React, { Component } from 'react';

import Biggo from './components/Biggo';
import LoadingScreen from './components/LoadingScreen';
import MiniList from './components/MiniList';
import ErrorMessage from './components/ErrorMessage';

import {
  configure as configureProductsService,
  getIds,
  getNextProductId,
  getPreviousProductId,
  getProduct,
  getProductIndex,
  getProducts,
  hasLoadedAllProducts,
  loadProducts,
} from './services/products';

configureProductsService({ products: new Map() });

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      isLoading: true,
      miniScrollOffset: null,
      products: getProducts(), // Returns an array
      productId: null,
      route: 'loading',
    };

    this.clearError = this.clearError.bind(this);
    this.displayError = this.displayError.bind(this);
    this.loadProducts = this.loadProducts.bind(this);
    this.navigateToBiggo = this.navigateToBiggo.bind(this);
    this.navigateToMini = this.navigateToMini.bind(this);
    this.navigateToNextProduct = this.navigateToNextProduct.bind(this);
    this.navigateToPreviousProduct = this.navigateToPreviousProduct.bind(this);
    this.navigateToProduct = this.navigateToProduct.bind(this);
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

  navigateToBiggo(productId) {
    this.setState({
      productId,
      route: 'biggo',
    });
  }

  navigateToMini() {
    const { productId } = this.state;
    const newState = {
      productId: null,
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

  /**
   * Navigate to the next/previous product.
   *
   * @todo Expose products as double linked list for Biggo?
   *
   * @param {Function} getNewProductId
   * @param {boolean} [throwError=false] Throw an error if `getNewProductId`
   * fails.
   */
  navigateToProduct(getNewProductId, throwError = false) {
    const { productId } = this.state;
    const newProductId = getNewProductId(productId);

    if (newProductId) {
      this.navigateToBiggo(newProductId);
    } else if (!hasLoadedAllProducts()) {
      loadProducts()
        .then((loadedProducts) => {
          this.setState({
            products: this.state.products.concat(loadedProducts),
          });
          return this.navigateToProduct(getNewProductId, true);
        })
        .catch(this.displayError);
    } else {
      const ids = getIds();
      const lastId = ids[ids.length - 1];

      if (productId === lastId) {
        // No `newProductId` and all have loaded: loop to beginning
        this.navigateToBiggo(ids[0]);
      } else if (productId === ids[0]) {
        // Loop to end
        this.navigateToBiggo(lastId);
      } else {
        const error = new Error(
          `Could not find new product ID from ${newProductId}`
        );

        if (throwError) {
          throw error;
        } else {
          console.error(error); // eslint-disable-line no-console
        }
      }
    }
  }

  navigateToNextProduct() {
    return this.navigateToProduct(getNextProductId);
  }

  navigateToPreviousProduct() {
    return this.navigateToProduct(getPreviousProductId);
  }

  render() {
    const {
      error,
      isLoading,
      miniScrollOffset,
      products,
      productId,
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
            onBackPress={this.navigateToMini}
            onNextPress={this.navigateToNextProduct}
            onPreviousPress={this.navigateToPreviousProduct}
            {...getProduct(productId)}
          />
        );
      default:
        return <LoadingScreen />;
    }
  }
}

