import { RECEIVE_USERNAME } from '../constants/actionTypes';

export * from './FriendsActions';
export * from './LoginActions';
export * from './OnboardingActions';
export * from './SetFilterActions';
export * from './HotgirlsActions';
export * from './HotgirlCommentsActions';

export const receiveUsername = username => ({
  type: RECEIVE_USERNAME,
  payload: username,
});
