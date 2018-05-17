import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 1,
    margin: 5,
    elevation: 1,
    padding: 10,
    minWidth: 70,
  },
  iconStyle: {
    width: 24,
    height: 24,
  },
  btnTextStyle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  iconStyleLarge: {
    width: 32,
    height: 32,
  },
  btnTextStyleLarge: {
    fontWeight: 'bold',
    fontSize: 30,
  },
});

const renderIcon = (icon, text, size) => {
  if (icon !== null) {
    return (
      <Image
        style={[
          size === 'small' ? styles.iconStyle : styles.iconStyleLarge,
          { marginRight: text !== '' ? 5 : 0 },
        ]}
        source={icon}
      />
    );
  }
  return null;
};

const renderText = (text, size, textColor) => {
  const { btnTextStyle, btnTextStyleLarge } = styles;
  if (text !== '') {
    return (
      <Text style={[size === 'small' ? btnTextStyle : btnTextStyleLarge, { color: textColor }]}>
        {text}
      </Text>
    );
  }
  return null;
};

const MyButton = ({
  onPress, text, icon, color, size, textColor,
}) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.buttonStyle, { backgroundColor: color }]}>
      {renderIcon(icon, text, size)}
      {renderText(text, size, textColor)}
    </View>
  </TouchableOpacity>
);

MyButton.propTypes = {
  onPress: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.node,
  color: PropTypes.string,
  textColor: PropTypes.string,
  size: PropTypes.string,
};

MyButton.defaultProps = {
  onPress: () => {},
  text: '',
  icon: null,
  color: 'white',
  textColor: 'black',
  size: 'small',
};

export default MyButton;
