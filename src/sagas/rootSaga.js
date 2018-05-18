import { all } from 'redux-saga/effects';
import { watchLogin, watchLogout } from './loginSagas';
import { watchFriendsRequest, watchMyFriendsRequest } from './friendsSagas';
import { watchFetchHotgirls } from './hotgirlsSagas';
import { watchCommentsRequest } from './hotgirlCommentsSagas';

export default function* rootSaga() {
  yield all([
    watchLogin(),
    watchFriendsRequest(),
    watchMyFriendsRequest(),
    watchFetchHotgirls(),
    watchCommentsRequest(),
    watchLogout(),
  ]);
}
