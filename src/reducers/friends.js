import {
  FRIEND_ADDED,
  FRIEND_CHANGED,
  MY_FRIEND_ADDED,
  MY_FRIEND_REMOVED,
  STOP_FRIENDS_REQUEST,
  STOP_MY_FRIENDS_REQUEST,
} from '../constants/actionTypes';

const friends = (
  state = {
    newFriends: [],
    myFriends: [],
  },
  action,
) => {
  switch (action.type) {
    case FRIEND_ADDED:
      return {
        ...state,
        newFriends: [...state.newFriends, { ...action.payload, isFriend: false }],
      };
    case FRIEND_CHANGED:
      return {
        ...state,
        newFriends: state.newFriends.map((friend) => {
          if (friend.id === action.payload.id) {
            return { ...friend, ...action.payload };
          }
          return friend;
        }),
      };
    case MY_FRIEND_ADDED:
      return {
        ...state,
        newFriends: state.newFriends.map((friend) => {
          if (friend.id === action.payload) {
            return { ...friend, isFriend: true };
          }
          return friend;
        }),
        myFriends: [...state.myFriends, action.payload],
      };
    case MY_FRIEND_REMOVED:
      return {
        ...state,
        newFriends: state.newFriends.map((friend) => {
          if (friend.id === action.payload) {
            return { ...friend, isFriend: false };
          }
          return friend;
        }),
        myFriends: state.myFriends.filter(friendId => friendId !== action.payload),
      };
    case STOP_FRIENDS_REQUEST:
      return {
        ...state,
        newFriends: [],
      };
    case STOP_MY_FRIENDS_REQUEST:
      return {
        ...state,
        myFriends: [],
      };
    default:
      return state;
  }
};

export default friends;
