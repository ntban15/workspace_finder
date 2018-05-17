import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import firebase from 'firebase';
import configureStore from './src/store/configureStore';
import App from './src/containers/App';

const config = {
  apiKey: 'AIzaSyD51wNw_IDL6kIzeir__2Bl448aaoLkahs',
  authDomain: 'social-network-f437d.firebaseapp.com',
  databaseURL: 'https://social-network-f437d.firebaseio.com',
  projectId: 'social-network-f437d',
  storageBucket: 'social-network-f437d.appspot.com',
  messagingSenderId: '933040599154',
};

firebase.initializeApp(config);

const { store } = configureStore();

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent('baitap2', () => Root);
