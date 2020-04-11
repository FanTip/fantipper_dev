import {
    createStore,
    applyMiddleware,
    compose
  } from 'redux'
  
  import thunk from 'redux-thunk';
  import rootReducer from './reducers'
  
  const initialState = {};
  
  const middleWare = [thunk]
  
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...middleWare),
      // This line must be commented before deploying
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ),
  
  )
  
  export default store;
  