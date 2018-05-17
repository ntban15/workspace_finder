import {
  FETCH_HOTGIRLS_PENDING,
  FETCH_HOTGIRLS_SUCCESS,
  FETCH_HOTGIRLS_FAIL,
  REMOVE_HOTGIRL,
  HOTGIRL_CHANGED,
} from '../actions';

const hotgirls = (
  state = {
    isFetching: false,
    hotgirls: [],
  },
  action,
) => {
  switch (action.type) {
    case FETCH_HOTGIRLS_PENDING:
      return { ...state, isFetching: true };
    case FETCH_HOTGIRLS_SUCCESS:
      return { isFetching: false, hotgirls: action.payload };
    case FETCH_HOTGIRLS_FAIL:
      return { ...state, isFetching: false };
    case REMOVE_HOTGIRL:
      return {
        ...state,
        hotgirls: state.hotgirls.filter(hotgirl => hotgirl.id !== action.payload),
      };
    case HOTGIRL_CHANGED:
      return {
        ...state,
        hotgirls: state.hotgirls.map((hotgirl) => {
          if (hotgirl.id === action.payload.id) {
            return { ...hotgirl, ...action.payload };
          }
          return hotgirl;
        }),
      };
    default:
      return state;
  }
};

export default hotgirls;
