/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import RootStack from '../router/RootNavigator';

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}
