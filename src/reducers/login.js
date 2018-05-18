import {
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_PENDING,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
} from '../constants/actionTypes';

const login = (
  state = {
    isLoggingIn: false,
    isLoggedIn: false,
  },
  action,
) => {
  switch (action.type) {
    case LOGIN_PENDING:
      return { isLoggingIn: true, isLoggedIn: false };
    case LOGIN_SUCCESS:
      return { isLoggingIn: false, isLoggedIn: true };
    case LOGOUT_PENDING:
      return { isLoggingIn: true, isLoggedIn: true };
    case LOGOUT_SUCCESS:
      return { isLoggingIn: false, isLoggedIn: false };
    case LOGIN_FAIL:
      return { ...state, isLoggingIn: false };
    case LOGOUT_FAIL:
      return { ...state, isLoggingIn: false };
    default:
      return state;
  }
};

export default login;
