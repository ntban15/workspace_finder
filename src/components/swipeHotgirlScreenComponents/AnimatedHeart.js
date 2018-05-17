import React, { Component } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

const loveImg = require('../../assets/images/loveicon.png');

class AnimatedHeart extends Component {
  static propTypes = {
    onAnimationCompleted: PropTypes.func,
  };

  static defaultProps = {
    onAnimationCompleted: () => {},
  };

  constructor(props) {
    super(props);
    this.animatedValue1 = new Animated.Value(0);

    this.state = {
      visible: false,
    };
  }

  // componentDidMount() {
  //   this.animate();
  // }

  componentWillUpdate() {
    if (this.state.visible) {
      this.animate();
    }
  }

  animate() {
    this.animatedValue1.setValue(0);
    Animated.timing(this.animatedValue1, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
    }).start(() => {
      this.props.onAnimationCompleted();
      this.setState({ visible: false });
    });
  }

  show() {
    this.setState({ visible: true });
  }

  render() {
    const opacity = this.animatedValue1.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    });
    const movingMargin = this.animatedValue1.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 200, 300],
    });
    if (this.state.visible) {
      return (
        <View style={styles.container}>
          <Animated.Image
            style={{ opacity, marginBottom: movingMargin }}
            source={loveImg}
            resizeMode="contain"
          />
        </View>
      );
    }
    return <View />;
  }
}

export default AnimatedHeart;
