import { take, call, put, fork, cancelled, cancel } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import firebase from 'firebase';

import {
  HOTGIRL_CHANGED,
  STOP_REQUEST_HOTGIRLS,
  REQUEST_FETCH_HOTGIRLS,
  FETCH_HOTGIRLS_SUCCESS,
  FETCH_HOTGIRLS_FAIL,
  FETCH_HOTGIRLS_PENDING,
} from '../constants/actionTypes';

function createHotgirlsChannel() {
  return eventChannel((emit) => {
    const hotgirlsRef = firebase.database().ref('hotgirls');

    const hotgirlChangeListener = hotgirlsRef.on('child_changed', (datasnapShot) => {
      emit({ type: HOTGIRL_CHANGED, payload: { ...datasnapShot.val(), id: datasnapShot.key } });
    });

    const unsubscribe = () => {
      hotgirlsRef.off('child_changed', hotgirlChangeListener);
    };

    return unsubscribe;
  });
}

function* watchHotgirlsChannel() {
  const hotgirlsChannel = yield call(createHotgirlsChannel);
  try {
    while (true) {
      const action = yield take(hotgirlsChannel);
      yield put(action);
    }
  } finally {
    if (yield cancelled()) {
      hotgirlsChannel.close();
    }
  }
}

function* fetchHotgirls() {
  const hotgirlsRef = firebase
    .database()
    .ref('hotgirls')
    .orderByChild('hearts')
    .limitToFirst(5);
  try {
    yield put({ type: FETCH_HOTGIRLS_PENDING });
    const dataSnapshot = yield call([hotgirlsRef, hotgirlsRef.once], 'value');
    const hotgirls = [];
    dataSnapshot.forEach((hotgirl) => {
      hotgirls.push({ ...hotgirl.val(), id: hotgirl.key });
    });
    yield put({ type: FETCH_HOTGIRLS_SUCCESS, payload: hotgirls });
    return true;
  } catch (e) {
    yield put({ type: FETCH_HOTGIRLS_FAIL, payload: e.message });
    return false;
  }
}

export function* watchFetchHotgirls() {
  yield take(REQUEST_FETCH_HOTGIRLS);
  while (yield call(fetchHotgirls)) {
    const task = yield fork(watchHotgirlsChannel);
    // const action =
    yield take([REQUEST_FETCH_HOTGIRLS, STOP_REQUEST_HOTGIRLS]);
    yield cancel(task);
    // if (action.type === STOP_REQUEST_HOTGIRLS) {
    // STOP_REQUEST_HOTGIRLS can cause problems when get out of hotgirl screen and comeback again
    //   break;
    // }
  }
}
