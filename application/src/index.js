import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// thunk middle ware
import {  createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducers from './Reducers/index';

const store = createStore(reducers, compose(applyMiddleware(thunk)))
// const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} >
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);