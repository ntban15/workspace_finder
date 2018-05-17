import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    height: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0054A5',
    paddingLeft: 15,
    paddingRight: 10,
  },
  containerIos: {
    height: 55 + 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0054A5',
    paddingTop: 24,
    paddingLeft: 15,
    paddingRight: 10,
  },
  imageStyle: {
    height: 50,
    width: 50,
  },
  titleStyle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

const isIos = Platform.OS === 'ios';

const fireImg = require('../assets/images/hotgirlicon.png');

const Header = ({ headerText, onHeaderButtonPress }) => (
  <View style={isIos ? styles.containerIos : styles.container}>
    <Text style={styles.titleStyle}>{headerText}</Text>
    <TouchableOpacity onPress={onHeaderButtonPress}>
      <Image style={styles.imageStyle} source={fireImg} />
    </TouchableOpacity>
  </View>
);

Header.propTypes = {
  headerText: PropTypes.string,
  onHeaderButtonPress: PropTypes.func,
};

Header.defaultProps = {
  headerText: 'NEW FRIENDS',
  onHeaderButtonPress: () => {},
};

export default Header;
