import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import rootReducer from '../reducers'
import { ENV } from '../config/config';

export default function configureStore(initialState) {
  const logger = createLogger();
  const store = ENV === 'development' ? createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, promise, logger)
  ) : createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk, promise)
  );

  return store;
}
