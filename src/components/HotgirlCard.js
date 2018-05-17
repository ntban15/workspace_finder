import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Platform,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import MyButton from './MyButton';
import CommentsContainer from '../containers/CommentsContainer';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    margin: 20,
    borderRadius: 20,
    elevation: 1,
  },
  shadingContainer: {
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
  },
  backgroundImageStyle: {
    borderRadius: 20,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  nameStyle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'black',
    textAlign: 'center',
  },
  descriptionStyle: {
    fontSize: 20,
    color: 'white',
    textShadowColor: 'black',
    textAlign: 'center',
  },
});

const isIos = Platform.OS === 'ios';
const heartIcon = require('../assets/images/heart_icon.png');
const discardIcon = require('../assets/images/delete_icon.png');

class HotgirlCard extends React.PureComponent {
  state = {
    commentEnabled: false,
    expanded: false,
  };

  handleExpand = () => {
    if (isIos) {
      LayoutAnimation.easeInEaseOut();
    }
    this.setState((state) => {
      if (!state.expanded) {
        return {
          expanded: true,
          commentEnabled: false,
        };
      }
      return {
        expanded: false,
      };
    });
  };

  renderInfo = (name, description) => {
    if (!this.state.expanded) {
      return (
        <View style={styles.infoContainer}>
          <Text style={styles.nameStyle} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
          <Text style={styles.descriptionStyle} numberOfLines={1} ellipsizeMode="tail">
            {description}
          </Text>
        </View>
      );
    }
    return null;
  };

  renderCommentBtn = () => {
    if (!this.state.expanded) {
      return (
        <MyButton
          onPress={() => {
            this.setState(state => ({ commentEnabled: !state.commentEnabled }));
          }}
          text="Bình luận"
        />
      );
    }
    return null;
  };

  renderComments = (id) => {
    if (this.state.commentEnabled) {
      return <CommentsContainer hotgirlId={id} />;
    }
    return null;
  };

  render() {
    const {
      hotgirl, onDiscardPress, onDatePress, onLovePress,
    } = this.props;
    const {
      id, name, description, hearts, picture,
    } = hotgirl;
    const { width } = Dimensions.get('window');

    return (
      <View style={[styles.container, { width: width - 40 }]}>
        <TouchableWithoutFeedback onPress={this.handleExpand}>
          <Image style={styles.backgroundImageStyle} source={{ uri: picture }} />
        </TouchableWithoutFeedback>

        <View style={styles.shadingContainer}>
          {this.renderInfo(name, description)}

          <View style={styles.buttonsContainer}>
            <MyButton onPress={() => onDiscardPress(id)} text="" icon={discardIcon} />
            <MyButton onPress={() => onDatePress(id)} text="Tôi muốn" textColor="orange" />
            <MyButton onPress={() => onLovePress(id)} text={`${-hearts}`} icon={heartIcon} />
          </View>

          {this.renderCommentBtn()}

          {this.renderComments(id)}
        </View>
      </View>
    );
  }
}

HotgirlCard.propTypes = {
  hotgirl: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    picture: PropTypes.string,
    hearts: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
  onDiscardPress: PropTypes.func.isRequired,
  onDatePress: PropTypes.func.isRequired,
  onLovePress: PropTypes.func.isRequired,
};

export default HotgirlCard;
