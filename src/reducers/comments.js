import { NEW_COMMENT, STOP_REQUEST_HOTGIRL_COMMENTS } from '../actions';

const comments = (state = [], action) => {
  switch (action.type) {
    case NEW_COMMENT:
      return [...state, action.payload];
    case STOP_REQUEST_HOTGIRL_COMMENTS:
      return [];
    default:
      return state;
  }
};

export default comments;
