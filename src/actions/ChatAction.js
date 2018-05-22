import { FETCH_MESSAGES, STOP_FETCH_MESSAGES, ADD_MESSAGE } from '../constants/actionTypes';

export const fetchMessages = chatId => ({ type: FETCH_MESSAGES, payload: chatId });
export const stopFetchMessages = chatId => ({ type: STOP_FETCH_MESSAGES, payload: chatId });
export const addMessage = msgPayload => ({
  type: ADD_MESSAGE,
  payload: msgPayload,
});
