import React from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import firebase from 'firebase';

import VerticalList from '../common/VerticalList';
import CustomTextInput from '../common/CustomTextInput';
import CustomButton from '../common/CustomButton';

import { requestHotgirlComments, stopRequestHotgirlComments } from '../../actions';

import { VERTICAL_LIST_MODE_COMMENT } from '../../constants/strings';

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
    token: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      authorName: PropTypes.string,
      author: PropTypes.string,
      body: PropTypes.string,
    })).isRequired,
    hotgirlId: PropTypes.string.isRequired,
    requestHotgirlComments: PropTypes.func.isRequired,
    stopRequestHotgirlComments: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.commentsRef = firebase.database().ref(`comments/${this.props.hotgirlId}`);
  }

  componentDidMount() {
    this.props.requestHotgirlComments(this.props.hotgirlId);
  }

  componentWillUnmount() {
    this.props.stopRequestHotgirlComments(this.props.hotgirlId);
  }

  handleCommentSubmit = () => {
    const { token, username } = this.props;
    this.commentsRef.push({ author: token, authorName: username, body: this.comment });
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
            color="#0054A5"
            textColor="white"
            onPress={() => this.handleCommentSubmit()}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  token: state.login.token,
  username: state.login.username,
  comments: state.comments,
});

const mapDispatchToProps = dispatch => ({
  requestHotgirlComments: id => dispatch(requestHotgirlComments(id)),
  stopRequestHotgirlComments: id => dispatch(stopRequestHotgirlComments(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentsView);
