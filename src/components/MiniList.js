import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ListView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import listBackground from '../images/list-background.png';
import Mini from './Mini';
import MiniListFooter from './MiniListFooter';
import MiniListLoading from './MiniListLoading';

const SCROLL_VIEW_REF = 'SCROLL_VIEW_REF';

const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    resizeMode: 'repeat',
    position: 'absolute',
    width: '100%',
  },
  container: {
    backgroundColor: 'cyan',
    flex: 1,
    position: 'relative',
  },
  footer: {
  },
  list: {
  },
  separator_1: {
    backgroundColor: 'thistle',
    height: 2,
  },
  separator_2: {
    backgroundColor: 'palegoldenrod',
    height: 2,
  },
  separator_3: {
    backgroundColor: 'lightsteelblue',
    height: 2,
  },
  separatorHighlighted: {
    backgroundColor: 'steelblue',
    height: 2,
  },
  top: {
    backgroundColor: 'cyan',
    height: 19,
    shadowColor: 'cyan',
    shadowOffset: {
      height: 6,
      width: 0,
    },
    shadowOpacity: 1,
    zIndex: 100,
  },
});

export default class MiniList extends Component {
  static renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    const style = adjacentRowHighlighted ?
      styles.separatorHighlighted :
      styles[`separator_${(rowId % 3) + 1}`];

    return (
      <View
        key={`${sectionId}-${rowId}`}
        style={style}
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

  componentDidMount() {
    const { initialScrollOffset } = this.props;

    /* eslint-disable react/no-string-refs */
    if (initialScrollOffset && this.refs[SCROLL_VIEW_REF]) {
      this.refs[SCROLL_VIEW_REF].scrollTo({
        animated: false,
        x: 0,
        y: initialScrollOffset,
      });
    }
    /* eslint-enable react/no-string-refs */
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.products.length !== nextProps.products.length) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.products),
      });
    }
  }

  renderFooter() {
    const loading = this.props.isLoading ? <MiniListLoading /> : undefined;

    return (
      <View style={styles.footer}>
        {loading}
        <MiniListFooter />
      </View>
    );
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
      <View style={styles.container}>
        <StatusBar
          background="cyan"
          barStyle="dark-content"
        />
        <Image
          source={listBackground}
          style={styles.backgroundImage}
        />
        <View style={styles.top} />
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections
          onEndReached={this.props.onEndReached}
          ref={SCROLL_VIEW_REF}
          renderFooter={this.renderFooter}
          renderRow={this.renderRow}
          renderSeparator={MiniList.renderSeparator}
          style={styles.list}
        />
      </View>
    );
  }
}

MiniList.defaultProps = {
  initialScrollOffset: 0,
};

MiniList.propTypes = {
  initialScrollOffset: PropTypes.number,
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

