import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
// import { persistStore } from 'redux-persist';
import rootReducer from '../reducers/rootReducer';
import rootSaga from '../sagas/rootSaga';

export default () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
  // const persistor = persistStore(store);
  sagaMiddleware.run(rootSaga);
  return { store };
};
