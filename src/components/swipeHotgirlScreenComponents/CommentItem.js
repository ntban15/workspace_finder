import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    margin: 5,
  },
  descriptionContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  nameStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
  bodyTextStyle: {
    color: 'white',
  },
});

const CommentItem = ({ comment }) => {
  const { authorName, body } = comment;
  return (
    <View style={styles.container}>
      <View style={styles.descriptionContainer}>
        <Text style={styles.nameStyle} numberOfLines={1} ellipsizeMode="tail">
          {authorName}
        </Text>
        <Text style={styles.bodyTextStyle}>{body || 'This is a comment'}</Text>
      </View>
    </View>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
    authorName: PropTypes.string,
    author: PropTypes.string,
    body: PropTypes.string,
  }).isRequired,
};

export default CommentItem;
