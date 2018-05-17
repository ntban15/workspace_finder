import { takeLatest, take, put, call, fork, cancelled, cancel } from 'redux-saga/effects';
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
    const { uid } = firebase.auth().currentUser || { uid: '' };

    const addListener = usersRef.on('child_added', (childSnapshot) => {
      if (childSnapshot.key !== uid) {
        emit({ type: FRIEND_ADDED, payload: { ...childSnapshot.val(), id: childSnapshot.key } });
      }
    });

    const changeListener = usersRef.on('child_changed', (childSnapshot) => {
      if (childSnapshot.val().id !== uid) {
        emit({ type: FRIEND_CHANGED, payload: { ...childSnapshot.val(), id: childSnapshot.key } });
      }
    });

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

function createFetchMyFriendsChannel(uid) {
  return eventChannel((emit) => {
    const myFriendsRef = firebase.database().ref(`friends/${uid}`);

    const addListener = myFriendsRef.on('child_added', (childSnapshot) => {
      emit({ type: MY_FRIEND_ADDED, payload: childSnapshot.key });
    });

    const removeListener = myFriendsRef.on('child_removed', (oldChildSnapshot) => {
      emit({ type: MY_FRIEND_REMOVED, payload: oldChildSnapshot.key });
    });

    const unsubscribe = () => {
      myFriendsRef.off('child_added', addListener);
      myFriendsRef.off('child_removed', removeListener);
    };

    return unsubscribe;
  });
}

function* watchMyFriendsChannel(uid) {
  const myFriendsChannel = yield call(createFetchMyFriendsChannel, uid);
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

function* watchFriends() {
  const task = yield fork(watchFriendsChannel);
  try {
    yield take(STOP_FRIENDS_REQUEST);
    yield cancel(task);
  } finally {
    if (yield cancelled()) {
      yield cancel(task);
    }
  }
}

function* watchMyFriends() {
  const uid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : '';
  if (uid === '') {
    return;
  }
  const task = yield fork(watchMyFriendsChannel, uid);
  try {
    yield take(STOP_MY_FRIENDS_REQUEST);
    yield cancel(task);
  } finally {
    if (yield cancelled()) {
      yield cancel(task);
    }
  }
}

export function* watchFriendsRequest() {
  yield takeLatest(FRIENDS_REQUEST, watchFriends);
}

export function* watchMyFriendsRequest() {
  yield takeLatest(MY_FRIENDS_REQUEST, watchMyFriends);
}
