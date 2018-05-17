import { createSwitchNavigator } from 'react-navigation';

import MainNavigator from './MainNavigator';

import OnboardScreen from '../containers/OnboardScreen';
import AuthLoadingScreen from '../containers/AuthLoadingScreen';

import { AUTH_LOADING_SCREEN, ONBOARD_SCREEN, MAIN_SCREEN } from '../constants/screens';

const RootStack = createSwitchNavigator(
  {
    [AUTH_LOADING_SCREEN]: AuthLoadingScreen,
    [ONBOARD_SCREEN]: { screen: OnboardScreen, navigationOptions: { header: null } },
    [MAIN_SCREEN]: MainNavigator,
  },
  {
    initialRouteName: AUTH_LOADING_SCREEN,
  },
);

export default RootStack;
