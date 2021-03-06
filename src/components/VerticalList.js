import React from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import FriendItem from './FriendItem';
import CommentItem from './CommentItem';

const styles = StyleSheet.create({
  separatorStyle: {
    height: 1,
    backgroundColor: '#e5e5e5',
  },
  emptyTextStyle: {
    color: '#8c8c8c',
    fontSize: 15,
  },
  emptyTextContainerWithPadding: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 200,
  },
  emptyTextContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  listFooterStyle: {
    height: 50,
  },
});

export default class VerticalList extends React.PureComponent {
  static propTypes = {
    comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      author: PropTypes.string,
      authorName: PropTypes.string,
      body: PropTypes.string,
    })),
    friends: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      avatar: PropTypes.string,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      isFriend: PropTypes.bool.isRequired,
    })),
    removeFriend: PropTypes.func,
    addFriend: PropTypes.func,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    comments: [],
    friends: [],
    removeFriend: () => {},
    addFriend: () => {},
  };

  keyExtractor = item => item.id;

  renderItem = (item, type) => {
    switch (type) {
      case 'FRIEND':
        return (
          <FriendItem
            friend={item}
            removeFriend={this.props.removeFriend}
            addFriend={this.props.addFriend}
          />
        );
      case 'COMMENT':
        return <CommentItem comment={item} />;
      default:
        return null;
    }
  };

  renderSeparator = () => <View style={styles.separatorStyle} />;

  renderEmpty = type => (
    <View
      style={type === 'FRIEND' ? styles.emptyTextContainerWithPadding : styles.emptyTextContainer}
    >
      <Text style={styles.emptyTextStyle}>
        {type === 'FRIEND' ? 'Không có nguời bạn nào' : 'Không có comment nào'}
      </Text>
    </View>
  );

  renderFooter = () => <View style={styles.listFooterStyle} />;

  render() {
    const { comments, friends, type } = this.props;

    return (
      <FlatList
        data={type === 'FRIEND' ? friends : comments}
        keyExtractor={this.keyExtractor}
        renderItem={({ item }) => this.renderItem(item, type)}
        ItemSeparatorComponent={this.renderSeparator}
        ListEmptyComponent={() => this.renderEmpty(type)}
        ListFooterComponent={this.renderFooter}
      />
    );
  }
}
