import { eventChannel } from 'redux-saga';
import firebase from 'firebase';
import {
  put,
  call,
  take,
  takeLatest,
  takeEvery,
  cancelled,
  buffers,
  fork,
  cancel,
} from 'redux-saga/effects';

import {
  ADD_MESSAGE_SUCCESS,
  FETCH_MESSAGES,
  STOP_FETCH_MESSAGES,
  ADD_MESSAGE,
} from '../constants/actionTypes';

const createChatChannel = chatId =>
  eventChannel((emit) => {
    const chatRef = firebase.database().ref(`chats/${chatId}`);

    const newMessageListener = chatRef.on('child_added', (dataSnapshot) => {
      emit({ type: ADD_MESSAGE_SUCCESS, payload: { ...dataSnapshot.val(), id: dataSnapshot.key } });
    });

    const unsubscribe = () => {
      firebase.off('child_added', newMessageListener);
    };

    return unsubscribe;
  }, buffers.expanding(50));

function* watchChatChannel(chatId) {
  const chatChannel = call(createChatChannel, chatId);
  try {
    while (true) {
      const action = yield take(chatChannel);
      yield put(action);
    }
  } finally {
    if (yield cancelled()) {
      chatChannel.close();
    }
  }
}

function* watchChat(chatId) {
  const chatTask = yield fork(watchChatChannel, chatId);
  yield take(({ type, payload }) => type === STOP_FETCH_MESSAGES && payload === chatId);
  yield cancel(chatTask);
}

export function* watchFetchChat() {
  yield takeLatest(FETCH_MESSAGES, ({ payload }) => watchChat(payload));
}

function* addMessage(msgPayload) {
  const {
    id, body, sender, senderName,
  } = msgPayload;
  const chatRef = firebase.database().ref(`chats/${id}`);
  yield call(chatRef, 'push', { body, sender, senderName });
}

export function* watchAddMessage() {
  yield takeEvery(ADD_MESSAGE, ({ payload }) => addMessage(payload));
}
