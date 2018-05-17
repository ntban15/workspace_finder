/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';
import OnboardScreen from './OnboardScreen';
import FriendsScreen from './FriendsScreen';
import SwipeHotgirlListScreen from './SwipeHotgirlListScreen';

const RootStack = createStackNavigator(
  {
    OnboardScreen: { screen: OnboardScreen, navigationOptions: { header: null } },
    FriendsScreen: { screen: FriendsScreen, navigationOptions: { header: null } },
    HotgirlsScreen: { screen: SwipeHotgirlListScreen, navigationOptions: { header: null } },
  },
  {
    initialRouteName: 'OnboardScreen',
  },
);

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}
