import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import reducer from './Store/reducer';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import './sass/main.scss';
import App from './App';

const store = createStore(reducer, applyMiddleware(thunk, logger))

ReactDOM.render(<Router>
  <Provider store={store}>
  <App />
  </Provider>
  </Router>, document.getElementById('root'));

