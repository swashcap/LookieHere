import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ListView,
  StyleSheet,
  View,
} from 'react-native';

import Mini from './Mini';
import MiniListLoading from './MiniListLoading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
  },
  separatorHighlighted: {
  },
});

export default class MiniList extends Component {
  static renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionId}-${rowId}`}
        style={
          adjacentRowHighlighted ?
          styles.separatorHighlighted :
          styles.separator
        }
      />
    );
  }

  static rowHasChanged(r1, r2) {
    return r1 !== r2;
  }

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: MiniList.rowHasChanged,
    });

    this.state = {
      dataSource: ds.cloneWithRows(props.products),
    };

    this.renderFooter = this.renderFooter.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.products.length !== nextProps.products.length) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.products),
      });
    }
  }

  renderFooter() {
    return this.props.isLoading ?
      <MiniListLoading /> :
      undefined;
  }

  renderRow(rowData, sectionId, rowId, highlightRow) {
    const onPress = () => {
      highlightRow(sectionId, rowId);
      this.props.onProductPress(rowData.productId);
    };

    return <Mini onPress={onPress} {...rowData} />;
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        onEndReached={this.props.onEndReached}
        renderFooter={this.renderFooter}
        renderRow={this.renderRow}
        renderSeparator={MiniList.renderSeparator}
        style={styles.container}
      />
    );
  }
}

MiniList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onEndReached: PropTypes.func.isRequired,
  onProductPress: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape({
    inStock: PropTypes.bool.isRequired,
    price: PropTypes.string.isRequired,
    productImage: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
  })).isRequired,
};

