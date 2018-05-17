import { createStackNavigator } from 'react-navigation';

import FriendsScreen from '../containers/FriendsScreen';
import SwipeHotgirlScreen from '../containers/SwipeHotgirlScreen';

import { FRIENDS_SCREEN, SWIPE_HOTGIRL_SCREEN } from '../constants/screens';

const MainNavigator = createStackNavigator(
  {
    [FRIENDS_SCREEN]: {
      screen: FriendsScreen,
      navigationOptions: { header: null },
    },
    [SWIPE_HOTGIRL_SCREEN]: {
      screen: SwipeHotgirlScreen,
      navigationOptions: { header: null },
    },
  },
  {
    initialRouteName: FRIENDS_SCREEN,
  },
);

export default MainNavigator;
