import { takeLatest, put, call } from 'redux-saga/effects';
import firebase from 'firebase';

import {
  LOGIN_REQUEST,
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_PENDING,
} from '../constants/actionTypes';

function* authorizeWithFirebase({ payload }) {
  const { email, password } = payload;
  try {
    yield put({ type: LOGIN_PENDING });
    yield call(
      // provide context for the function with this syntax
      // in this case, firebase.auth() is the context for signInWithEmailAndPassword
      [firebase.auth(), firebase.auth().signInWithEmailAndPassword],
      email, // arguments are passed seperately
      password,
    );
    yield put({
      type: LOGIN_SUCCESS,
    });
  } catch (e) {
    yield put({ type: LOGIN_FAIL, payload: e.message });
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN_REQUEST, authorizeWithFirebase);
}

function* logoutFirebase() {
  try {
    yield put({ type: LOGOUT_PENDING });
    yield call([firebase.auth(), firebase.auth().signOut]);
    yield put({ type: LOGOUT_SUCCESS });
  } catch (e) {
    yield put({ type: LOGOUT_FAIL, payload: e.message });
  }
}

export function* watchLogout() {
  yield takeLatest(LOGOUT_REQUEST, logoutFirebase);
}
