import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  footerBtnStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBtnTextStyle: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});

const Footer = ({
  onPress, backgroundColor, text, textColor,
}) => (
  <TouchableOpacity style={[styles.footerBtnStyle, { backgroundColor }]} onPress={onPress}>
    <Text style={[styles.footerBtnTextStyle, { color: textColor }]}>{text}</Text>
  </TouchableOpacity>
);

Footer.propTypes = {
  onPress: PropTypes.func,
  backgroundColor: PropTypes.string,
  text: PropTypes.string,
  textColor: PropTypes.string,
};

Footer.defaultProps = {
  onPress: () => {},
  backgroundColor: 'grey',
  text: '',
  textColor: 'white',
};

export default Footer;
