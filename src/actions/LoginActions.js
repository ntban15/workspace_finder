import { LOGIN_REQUEST } from '../constants/actionTypes';

export const requestLogin = (email, password) => ({
  type: LOGIN_REQUEST,
  payload: {
    email,
    password,
  },
});
