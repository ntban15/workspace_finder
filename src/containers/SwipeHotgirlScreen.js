/* eslint no-unused-expressions: 0 */

import React from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { View, Image, Animated, PanResponder, Dimensions, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import HotgirlCard from '../components/swipeHotgirlScreenComponents/HotgirlCard';

import LoadingSpinner from '../components/common/LoadingSpinner';
import CustomButton from '../components/common/CustomButton';

import { requestFetchHotgirls, stopRequestHotgirls, removeHotgirl } from '../actions';

import { MAIN_HIGHLIGHT_COLOR } from '../constants/colors';
import {
  HOTGIRL_CARD_HEIGHT,
  HOTGIRL_CARD_WIDTH,
  HOTGIRL_CARD_BORDER_RADIUS,
} from '../constants/dimensions';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
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
  animatedContainer: {
    height: HOTGIRL_CARD_HEIGHT,
    width: HOTGIRL_CARD_WIDTH,
    borderRadius: HOTGIRL_CARD_BORDER_RADIUS,
  },
  preloadedImage: {
    width: 0,
    height: 0,
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
    nextHotGirl: PropTypes.shape({
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
    nextHotGirl: null,
  };

  constructor(props) {
    super(props);

    this.position = new Animated.ValueXY();

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 10,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: getYValue(Math.abs(gestureState.dx)) });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          this.handleLove(this.props.currentHotGirl.id);
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          this.handleDiscard(this.props.currentHotGirl.id);
        } else {
          // reset position of hotgirl card
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
    return (
      this.props.currentHotGirl !== nextProps.currentHotGirl ||
      this.props.nextHotGirl !== nextProps.nextHotGirl
    );
  }

  componentWillUnmount() {
    this.props.stopRequestHotgirls();
  }

  getAnimatedStyle = () => {
    const rotateInterpolation = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [`${MAX_RAD}deg`, '0deg', `-${MAX_RAD}deg`],
    });

    const opacityInterpolation = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: [0, 1, 0],
    });

    const colorInterpolation = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['orange', 'white', 'green'],
    });

    return [
      styles.animatedContainer,
      {
        ...this.position.getLayout(),
        backgroundColor: colorInterpolation,
        opacity: opacityInterpolation,
        transform: [
          {
            rotate: rotateInterpolation,
          },
        ],
      },
    ];
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

  renderCard = () => {
    if (this.props.currentHotGirl) {
      return (
        <Animated.View {...this.panResponder.panHandlers} style={this.getAnimatedStyle()}>
          <HotgirlCard
            hotgirl={this.props.currentHotGirl}
            onDatePress={id => this.handleDate(id)}
            onLovePress={id => this.handleLove(id)}
            onDiscardPress={id => this.handleDiscard(id)}
          />
          <Image
            style={styles.preloadedImage}
            source={{ uri: this.props.nextHotGirl ? this.props.nextHotGirl.picture : 'www' }}
          />
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
      return <View style={styles.container}>{this.renderCard()}</View>;
    }
    return <LoadingSpinner size="large" color={MAIN_HIGHLIGHT_COLOR} />;
  }
}

const mapStateToProps = state => ({
  isFetching: state.hotgirls.isFetching,
  currentHotGirl: state.hotgirls.hotgirls.length >= 1 ? state.hotgirls.hotgirls[0] : null,
  nextHotGirl: state.hotgirls.hotgirls.length >= 2 ? state.hotgirls.hotgirls[1] : null,
});

const mapDispatchToProps = dispatch => ({
  requestFetchHotgirls: () => dispatch(requestFetchHotgirls()),
  stopRequestHotgirls: () => dispatch(stopRequestHotgirls()),
  removeHotgirl: id => dispatch(removeHotgirl(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwipeHotGirlScreen);
