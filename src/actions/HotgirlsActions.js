import { REMOVE_HOTGIRL, REQUEST_FETCH_HOTGIRLS, STOP_REQUEST_HOTGIRLS } from '../actions';

export const stopRequestHotgirls = () => ({ type: STOP_REQUEST_HOTGIRLS });

export const requestFetchHotgirls = () => ({ type: REQUEST_FETCH_HOTGIRLS });

export const removeHotgirl = id => ({ type: REMOVE_HOTGIRL, payload: id });
