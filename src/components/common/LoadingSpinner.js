import React from 'react';
import { View, ActivityIndicator, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ color, size }) => {
  const { width, height } = Dimensions.get('window');
  return (
    <View
      style={{
        position: 'absolute',
        top: height / 2,
        bottom: height / 2,
        right: width / 2,
        left: width / 2,
      }}
    >
      <ActivityIndicator color={color} size={size} />
    </View>
  );
};

LoadingSpinner.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};

LoadingSpinner.defaultProps = {
  color: 'grey',
  size: 'large',
};

export default LoadingSpinner;
