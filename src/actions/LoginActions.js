import { LOGIN_REQUEST, LOGOUT_REQUEST } from '../constants/actionTypes';

export const requestLogin = (email, password) => ({
  type: LOGIN_REQUEST,
  payload: {
    email,
    password,
  },
});

export const requestLogout = () => ({ type: LOGOUT_REQUEST });
