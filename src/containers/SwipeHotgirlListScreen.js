import React from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { FlatList, View, LayoutAnimation, UIManager, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { requestFetchHotgirls, stopRequestHotgirls, removeHotgirl } from '../actions';
import HotgirlCard from '../components/HotgirlCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AnimatedHeart from '../components/AnimatedHeart';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: 'white',
  },
});

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

class SwipeHotGirlScreen extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    hotgirls: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      picture: PropTypes.string,
      hearts: PropTypes.number,
      description: PropTypes.string,
    })).isRequired,
    requestFetchHotgirls: PropTypes.func.isRequired,
    stopRequestHotgirls: PropTypes.func.isRequired,
    removeHotgirl: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.requestFetchHotgirls();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.hotgirls !== nextProps.hotgirls;
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentDidUpdate() {
    if (this.props.hotgirls.length === 0) {
      this.props.requestFetchHotgirls();
    }
  }

  componentWillUnmount() {
    this.props.stopRequestHotgirls();
  }

  handleDate = (id) => {
    this.animatedHeartRef.show();
    const { uid } = firebase.auth().currentUser || { uid: 'notloggedin' };
    firebase
      .database()
      .ref(`dates/${uid}/${id}`)
      .set(true)
      .then(() => {
        this.props.removeHotgirl(id);
      });
  };

  handleLove = (id) => {
    const hotgirlRef = firebase.database().ref(`hotgirls/${id}`);
    hotgirlRef.transaction(hotgirl => ({ ...hotgirl, hearts: hotgirl.hearts - 1 })).then(() => {
      this.props.removeHotgirl(id);
    });
  };

  handleDiscard = (id) => {
    this.props.removeHotgirl(id);
  };

  keyExtractor = item => item.id;

  renderCard = item => (
    <HotgirlCard
      hotgirl={item}
      onDatePress={id => this.handleDate(id)}
      onLovePress={id => this.handleLove(id)}
      onDiscardPress={id => this.handleDiscard(id)}
    />
  );

  render() {
    if (!this.props.isFetching) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.props.hotgirls}
            renderItem={({ item }) => this.renderCard(item)}
            horizontal
            keyExtractor={this.keyExtractor}
            scrollEnabled={false}
          />
          <AnimatedHeart
            ref={(ref) => {
              this.animatedHeartRef = ref;
            }}
          />
        </View>
      );
    }
    return <LoadingSpinner size="large" color="#0054A5" />;
  }
}

const mapStateToProps = state => ({
  isFetching: state.hotgirls.isFetching,
  hotgirls: state.hotgirls.hotgirls,
});

const mapDispatchToProps = dispatch => ({
  requestFetchHotgirls: () => dispatch(requestFetchHotgirls()),
  stopRequestHotgirls: () => dispatch(stopRequestHotgirls()),
  removeHotgirl: id => dispatch(removeHotgirl(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SwipeHotGirlScreen);
