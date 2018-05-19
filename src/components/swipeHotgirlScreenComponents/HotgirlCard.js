import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  LayoutAnimation,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import CommentsView from './CommentsView';

import CustomButton from '../common/CustomButton';

import {
  HOTGIRL_CARD_HEIGHT,
  HOTGIRL_CARD_WIDTH,
  HOTGIRL_CARD_BORDER_RADIUS,
} from '../../constants/dimensions';

const styles = StyleSheet.create({
  container: {
    height: HOTGIRL_CARD_HEIGHT,
    width: HOTGIRL_CARD_WIDTH,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    borderRadius: HOTGIRL_CARD_BORDER_RADIUS,
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
const heartIcon = require('../../assets/images/heart_icon.png');
const discardIcon = require('../../assets/images/delete_icon.png');

class HotgirlCard extends React.Component {
  state = {
    commentEnabled: false,
    expanded: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.commentEnabled !== nextState.commentEnabled ||
      this.state.expanded !== nextState.expanded ||
      this.props.hotgirl !== nextProps.hotgirl
    );
  }

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
        <CustomButton
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
      return <CommentsView hotgirlId={id} />;
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

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleExpand}>
          <Image style={styles.backgroundImageStyle} source={{ uri: picture }} />
        </TouchableWithoutFeedback>

        <View style={styles.shadingContainer}>
          {this.renderInfo(name, description)}

          <View style={styles.buttonsContainer}>
            <CustomButton onPress={() => onDiscardPress(id)} text="" icon={discardIcon} />
            <CustomButton onPress={() => onDatePress(id)} text="Tôi muốn" textColor="orange" />
            <CustomButton onPress={() => onLovePress(id)} text={`${-hearts}`} icon={heartIcon} />
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
