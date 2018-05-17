import { SET_FILTER } from '../constants/actionTypes';
import { FILTER_MODE_NEW_FRIENDS } from '../constants/strings';

const filter = (state = FILTER_MODE_NEW_FRIENDS, action) => {
  switch (action.type) {
    case SET_FILTER:
      return action.payload;
    default:
      return state;
  }
};

export default filter;
