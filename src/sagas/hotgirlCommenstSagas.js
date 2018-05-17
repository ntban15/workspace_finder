import { take, takeEvery, put, call, fork, cancelled, cancel } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import firebase from 'firebase';
import { REQUEST_HOTGIRL_COMMENTS, STOP_REQUEST_HOTGIRL_COMMENTS, NEW_COMMENT } from '../actions';

function createCommentsChannel(id) {
  return eventChannel((emit) => {
    const hotgirlCommentsRef = firebase.database().ref(`comments/${id}`);

    const commentsListener = hotgirlCommentsRef.on('child_added', (dataSnapshot) => {
      emit({
        type: NEW_COMMENT,
        payload: { ...dataSnapshot.val(), id: dataSnapshot.key },
      });
    });

    const unsubscribe = () => hotgirlCommentsRef.off('child_added', commentsListener);

    return unsubscribe;
  });
}

function* watchCommentsChannel(id) {
  const commentsChannel = yield call(createCommentsChannel, id);
  try {
    while (true) {
      const action = yield take(commentsChannel);
      yield put(action);
    }
  } finally {
    if (yield cancelled()) {
      commentsChannel.close();
    }
  }
}

function* watchComments(action1) {
  const task = yield fork(watchCommentsChannel, action1.payload);
  try {
    while (true) {
      const action2 = yield take(STOP_REQUEST_HOTGIRL_COMMENTS);
      if (action1.payload === action2.payload) {
        yield cancel(task);
        break;
      }
    }
  } finally {
    yield cancel(task);
  }
}

export function* watchCommentsRequest() {
  yield takeEvery(REQUEST_HOTGIRL_COMMENTS, watchComments);
}
