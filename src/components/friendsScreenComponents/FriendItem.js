import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
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
  avatarStyle: {
    height: 50,
    width: 50,
    marginRight: 10,
    resizeMode: 'cover',
    borderRadius: 200,
  },
  descriptionContainer: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  buttonStyle: {
    flex: 1,
  },
  titleStyle: {
    fontWeight: 'bold',
  },
});

const FriendItem = ({ friend, addFriend, removeFriend }) => {
  const {
    id, avatar, name, description, isFriend,
  } = friend;
  return (
    <View style={styles.container}>
      <Image
        style={styles.avatarStyle}
        source={{
          uri: avatar || 'https://avatars1.githubusercontent.com/u/9919?s=200&v=4',
        }}
        resizeMode="contain"
        resizeMethod="resize"
      />

      <View style={styles.descriptionContainer}>
        <Text style={styles.titleStyle} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <Text>{description || 'No description'}</Text>
      </View>

      <View style={styles.buttonStyle}>
        <Button
          title={isFriend ? 'Hủy' : 'Kết bạn'}
          onPress={() => (isFriend ? removeFriend(id, name) : addFriend(id, name))}
          color={isFriend ? 'grey' : '#0054A5'}
        />
      </View>
    </View>
  );
};

FriendItem.propTypes = {
  friend: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isFriend: PropTypes.bool.isRequired,
    description: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  removeFriend: PropTypes.func.isRequired,
  addFriend: PropTypes.func.isRequired,
};

export default FriendItem;
