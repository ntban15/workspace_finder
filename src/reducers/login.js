import { LOGIN_PENDING, LOGIN_SUCCESS, LOGIN_FAIL } from '../constants/actionTypes';

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
    case LOGIN_FAIL:
      return { isLoggingIn: false, isLoggedIn: false };
    default:
      return state;
  }
};

export default login;
