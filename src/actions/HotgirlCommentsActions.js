import { REQUEST_HOTGIRL_COMMENTS, STOP_REQUEST_HOTGIRL_COMMENTS } from '.';

export const requestHotgirlComments = id => ({ type: REQUEST_HOTGIRL_COMMENTS, payload: id });

export const stopRequestHotgirlComments = id => ({
  type: STOP_REQUEST_HOTGIRL_COMMENTS,
  payload: id,
});
