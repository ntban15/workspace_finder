import { RECEIVE_USERNAME } from '../constants/actionTypes';

const username = (state = '', action) => {
  switch (action.type) {
    case RECEIVE_USERNAME:
      return action.payload;
    default:
      return state;
  }
};

export default username;
