import {
  FRIENDS_REQUEST,
  MY_FRIENDS_REQUEST,
  STOP_FRIENDS_REQUEST,
  STOP_MY_FRIENDS_REQUEST,
} from './types';

export const requestFriends = () => ({ type: FRIENDS_REQUEST });

export const stopRequestFriends = () => ({ type: STOP_FRIENDS_REQUEST });

export const requestMyFriends = () => ({ type: MY_FRIENDS_REQUEST });

export const stopRequestMyFriends = () => ({ type: STOP_MY_FRIENDS_REQUEST });
