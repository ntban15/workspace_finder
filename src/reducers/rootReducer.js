import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import filter from './filter';
import onboard from './onboard';
import friends from './friends';
import login from './login';
import hotgirls from './hotgirls';
import comments from './comments';
import username from './username';

const loginConfig = {
  key: 'login',
  storage: AsyncStorage,
  whitelist: ['isLoggedIn'],
};

const rootConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['username', 'onboard'],
};

const rootReducer = combineReducers({
  filter,
  onboard,
  friends,
  login: persistReducer(loginConfig, login),
  hotgirls,
  comments,
  username,
});

export default persistReducer(rootConfig, rootReducer);
