import { createStackNavigator } from 'react-navigation';
import OnboardScreen from '../containers/OnboardScreen';
import FriendsScreen from '../containers/FriendsScreen';
import SwipeHotgirlScreen from '../containers/SwipeHotgirlScreen';

const RootStack = createStackNavigator(
  {
    OnboardScreen: { screen: OnboardScreen, navigationOptions: { header: null } },
    FriendsScreen: { screen: FriendsScreen, navigationOptions: { header: null } },
    HotgirlsScreen: { screen: SwipeHotgirlScreen, navigationOptions: { header: null } },
  },
  {
    initialRouteName: 'OnboardScreen',
  },
);

export default RootStack;
