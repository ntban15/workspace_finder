import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import VerticalList from '../common/VerticalList';
import CustomTextInput from '../common/CustomTextInput';
import CustomButton from '../common/CustomButton';

import { requestHotgirlComments, stopRequestHotgirlComments, receiveUsername } from '../../actions';

import { VERTICAL_LIST_MODE_COMMENT } from '../../constants/strings';
import { MAIN_HIGHLIGHT_COLOR } from '../../constants/colors';

const styles = StyleSheet.create({
  commentInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  commentsContainer: {
    height: 250,
    alignSelf: 'stretch',
  },
});

class CommentsView extends React.Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      authorName: PropTypes.string,
      author: PropTypes.string,
      body: PropTypes.string,
    })).isRequired,
    hotgirlId: PropTypes.string.isRequired,
    receiveUsername: PropTypes.func.isRequired,
    requestHotgirlComments: PropTypes.func.isRequired,
    stopRequestHotgirlComments: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.requestHotgirlComments(this.props.hotgirlId);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.comments.length !== nextProps.comments.length;
  }

  componentWillUnmount() {
    this.props.stopRequestHotgirlComments(this.props.hotgirlId);
  }

  commentsRef = firebase.database().ref(`comments/${this.props.hotgirlId}`);

  handleCommentSubmit = () => {
    const { uid } = firebase.auth().currentUser;
    // no username exists => fetch and cache
    if (this.props.username === '') {
      firebase
        .database()
        .ref(`users/${uid}/name`)
        .once('value')
        .then((dataSnapshot) => {
          this.props.receiveUsername(dataSnapshot.val());
          this.commentsRef.push({
            author: uid,
            authorName: dataSnapshot.val(),
            body: this.comment,
          });
        })
        .catch(() => {}); // TODO: HANDLE SUBMIT ERROR
    } else {
      this.commentsRef.push({
        author: uid,
        authorName: this.props.username,
        body: this.comment,
      });
    }
  };

  render() {
    return (
      <View style={styles.commentsContainer}>
        <VerticalList comments={this.props.comments} type={VERTICAL_LIST_MODE_COMMENT} />
        <View style={styles.commentInputContainer}>
          <CustomTextInput
            highlightColor="white"
            highlightTextColor="black"
            placeholder="Bình luận"
            width={200}
            onChangeText={(comment) => {
              this.comment = comment;
            }}
          />

          <CustomButton
            text="Gửi"
            color={MAIN_HIGHLIGHT_COLOR}
            textColor="white"
            onPress={() => this.handleCommentSubmit()}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  username: state.username,
  comments: state.comments,
});

const mapDispatchToProps = dispatch => ({
  requestHotgirlComments: id => dispatch(requestHotgirlComments(id)),
  stopRequestHotgirlComments: id => dispatch(stopRequestHotgirlComments(id)),
  receiveUsername: username => dispatch(receiveUsername(username)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsView);
