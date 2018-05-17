import { take, put, call, fork, cancelled, cancel } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import firebase from 'firebase';

import {
  FRIEND_ADDED,
  FRIEND_CHANGED,
  MY_FRIEND_ADDED,
  MY_FRIEND_REMOVED,
  FRIENDS_REQUEST,
  MY_FRIENDS_REQUEST,
  STOP_FRIENDS_REQUEST,
  STOP_MY_FRIENDS_REQUEST,
} from '../constants/actionTypes';

function createFetchFriendsChannel() {
  return eventChannel((emit) => {
    const usersRef = firebase.database().ref('users');
    const { uid } = firebase.auth().currentUser || { uid: 'notloggedin' };

    const friendAddHandler = (childSnapshot) => {
      if (childSnapshot.key !== uid) {
        emit({ type: FRIEND_ADDED, payload: { ...childSnapshot.val(), id: childSnapshot.key } });
      }
    };

    const friendChangeHandler = (childSnapshot) => {
      if (childSnapshot.val().id !== uid) {
        emit({ type: FRIEND_CHANGED, payload: { ...childSnapshot.val(), id: childSnapshot.key } });
      }
    };

    const addListener = usersRef.on('child_added', friendAddHandler);
    const changeListener = usersRef.on('child_changed', friendChangeHandler);

    const unsubscribe = () => {
      usersRef.off('child_added', addListener);
      usersRef.off('child_changed', changeListener);
    };

    return unsubscribe;
  });
}

function* watchFriendsChannel() {
  const friendsChannel = yield call(createFetchFriendsChannel);
  try {
    while (true) {
      const action = yield take(friendsChannel);
      yield put(action);
    }
  } finally {
    if (yield cancelled()) {
      friendsChannel.close();
    }
  }
}

function createFetchMyFriendsChannel() {
  return eventChannel((emit) => {
    const { uid } = firebase.auth().currentUser || { uid: 'notloggedin' };
    const myFriendsRef = firebase.database().ref(`friends/${uid}`);

    const myFriendAddHandler = (childSnapshot) => {
      emit({ type: MY_FRIEND_ADDED, payload: childSnapshot.key });
    };

    const myFriendRemoveHandler = (oldChildSnapshot) => {
      emit({ type: MY_FRIEND_REMOVED, payload: oldChildSnapshot.key });
    };

    const addListener = myFriendsRef.on('child_added', myFriendAddHandler);
    const removeListener = myFriendsRef.on('child_removed', myFriendRemoveHandler);

    const unsubscribe = () => {
      myFriendsRef.off('child_added', addListener);
      myFriendsRef.off('child_removed', removeListener);
    };

    return unsubscribe;
  });
}

function* watchMyFriendsChannel() {
  const myFriendsChannel = yield call(createFetchMyFriendsChannel);
  try {
    while (true) {
      const action = yield take(myFriendsChannel);
      yield put(action);
    }
  } finally {
    if (yield cancelled()) {
      myFriendsChannel.close();
    }
  }
}

export function* watchFriends() {
  yield take(FRIENDS_REQUEST);
  const task = yield fork(watchFriendsChannel);
  yield take(STOP_FRIENDS_REQUEST);
  yield cancel(task);
}

export function* watchMyFriends() {
  yield take(MY_FRIENDS_REQUEST);
  const task = yield fork(watchMyFriendsChannel);
  yield take(STOP_MY_FRIENDS_REQUEST);
  yield cancel(task);
}
