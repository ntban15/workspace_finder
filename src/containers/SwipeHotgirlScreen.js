/* eslint no-unused-expressions: 0 */

import React from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { View, Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import HotgirlCard from '../components/swipeHotgirlScreenComponents/HotgirlCard';

import LoadingSpinner from '../components/common/LoadingSpinner';

import { requestFetchHotgirls, stopRequestHotgirls, removeHotgirl } from '../actions';
import { MAIN_HIGHLIGHT_COLOR } from '../constants/colors';
import CustomButton from '../components/common/CustomButton';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SWIPE_THRESHOLD = SCREEN_WIDTH / 2;
const RADIUS = SCREEN_HEIGHT / 2;
const MAX_RAD = Math.asin(SCREEN_WIDTH / 2 / RADIUS) * (180 / Math.PI).toFixed(0);
const getYValue = (dx) => {
  const rad = Math.asin(dx / RADIUS);
  const offsetY = dx / Math.tan(rad);
  return -(RADIUS - offsetY);
};
// TODO: SWIPE TO MUCH -> BREAK
// TODO: Load Image prematurely
// TODO: iOS View is shrunk when reset position many times
// TODO: change color when swipe according to direction

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

class SwipeHotGirlScreen extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    currentHotGirl: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      picture: PropTypes.string,
      hearts: PropTypes.number,
      description: PropTypes.string,
    }),
    requestFetchHotgirls: PropTypes.func.isRequired,
    stopRequestHotgirls: PropTypes.func.isRequired,
    removeHotgirl: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentHotGirl: null,
  };

  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: getYValue(Math.abs(gestureState.dx)) });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          this.handleLove(this.props.currentHotGirl.id);
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          this.handleDiscard(this.props.currentHotGirl.id);
        } else {
          Animated.timing(this.position, {
            toValue: {
              x: 0,
              y: 0,
            },
          }).start();
        }
      },
    });
  }

  componentDidMount() {
    this.props.requestFetchHotgirls();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.currentHotGirl !== nextProps.currentHotGirl;
  }

  componentWillUnmount() {
    this.props.stopRequestHotgirls();
  }

  getAnimatedStyle = () => {
    const rotateInterpolation = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [`${MAX_RAD}deg`, '0deg', `-${MAX_RAD}deg`],
    });

    return {
      ...this.position.getLayout(),
      transform: [
        {
          rotate: rotateInterpolation,
        },
      ],
    };
  };

  getCardOpacityStyle = () => {
    const opacityInterpolation = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [0, 1, 0],
    });

    return {
      opacity: opacityInterpolation,
    };
  };

  replaceHotgirl = () => {
    this.position.setValue({ x: 0, y: SCREEN_HEIGHT * 1.5 });
    Animated.timing(this.position, { toValue: { x: 0, y: 0 } }).start();
  };

  handleDate = (id) => {
    const { uid } = firebase.auth().currentUser;
    firebase
      .database()
      .ref(`dates/${uid}/${id}`)
      .set(true)
      .then(() => {
        Animated.timing(this.position, { toValue: { x: 0, y: -SCREEN_HEIGHT * 1.5 } }).start(() => {
          this.props.removeHotgirl(id);
          this.replaceHotgirl();
        });
      });
  };

  handleLove = (id) => {
    const hotgirlRef = firebase.database().ref(`hotgirls/${id}`);

    Animated.timing(this.position, {
      toValue: {
        x: SCREEN_WIDTH,
        y: -SCREEN_HEIGHT,
      },
    }).start(() => {
      hotgirlRef.transaction(hotgirl => ({ ...hotgirl, hearts: hotgirl.hearts - 1 }));
      this.props.removeHotgirl(id);
      this.replaceHotgirl();
    });
  };

  handleDiscard = (id) => {
    Animated.timing(this.position, {
      toValue: {
        x: -SCREEN_WIDTH,
        y: -SCREEN_HEIGHT,
      },
    }).start(() => {
      this.props.removeHotgirl(id);
      this.replaceHotgirl();
    });
  };

  renderCard = (item) => {
    if (item !== null) {
      return (
        <Animated.View {...this.panResponder.panHandlers} style={this.getAnimatedStyle()}>
          <Animated.View style={this.getCardOpacityStyle()}>
            <HotgirlCard
              hotgirl={item}
              onDatePress={id => this.handleDate(id)}
              onLovePress={id => this.handleLove(id)}
              onDiscardPress={id => this.handleDiscard(id)}
            />
          </Animated.View>
        </Animated.View>
      );
    }
    return (
      <CustomButton
        color={MAIN_HIGHLIGHT_COLOR}
        text="Tìm thêm"
        textColor="white"
        size="large"
        onPress={() => {
          this.props.requestFetchHotgirls();
        }}
      />
    );
  };

  render() {
    if (!this.props.isFetching) {
      return <View style={styles.container}>{this.renderCard(this.props.currentHotGirl)}</View>;
    }
    return <LoadingSpinner size="large" color={MAIN_HIGHLIGHT_COLOR} />;
  }
}

const mapStateToProps = state => ({
  isFetching: state.hotgirls.isFetching,
  currentHotGirl: state.hotgirls.hotgirls.length > 0 ? state.hotgirls.hotgirls[0] : null,
});

const mapDispatchToProps = dispatch => ({
  requestFetchHotgirls: () => dispatch(requestFetchHotgirls()),
  stopRequestHotgirls: () => dispatch(stopRequestHotgirls()),
  removeHotgirl: id => dispatch(removeHotgirl(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwipeHotGirlScreen);
