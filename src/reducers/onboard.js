import { ONBOARD } from '../actions/types';

const onboard = (state = false, action) => {
  switch (action.type) {
    case ONBOARD:
      return true;
    default:
      return state;
  }
};

export default onboard;
