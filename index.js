import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import firebase from 'firebase';

import configureStore from './src/store/configureStore';

import App from './src/containers/App';

import { firebaseConfig } from './src/constants/apis';

firebase.initializeApp(firebaseConfig);

const { store, persistor } = configureStore();

const Root = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

AppRegistry.registerComponent('baitap2', () => Root);
